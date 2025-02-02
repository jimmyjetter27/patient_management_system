import ParentLayout from '@/Layouts/ParentLayout';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import React, {useEffect, useMemo, useState} from "react";
import DataTable from 'react-data-table-component';
import {Head, usePage, useForm, router} from "@inertiajs/react";
import Modal from "@/Components/Modal.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import ServiceFormComponent from "@/Components/ServiceFormComponent.jsx";

const Patient = ({auth}) => {
    const [patientData, setPatientData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const {appUrl, errors} = usePage().props;

    const [confirmingPatientStore, setConfirmingPatientStore] = useState(false);
    const [confirmingPatientUpdate, setConfirmingPatientUpdate] = useState(false);
    const [confirmingPatientDeletion, setConfirmingPatientDeletion] = useState(false);

    const closePatientStore = () => setConfirmingPatientStore(false);


    const [selectedPatient, setSelectedPatient] = useState({
        name: '',
        age: '',
        hospital_id: '',
        date_of_scan: '',
        gestational_age: '',
        parity_gravidity: '',
        referring_physician: ''
    });

    const [values, setValues] = useState(selectedPatient);
    const confirmPatientStore = () => setConfirmingPatientStore(true);

    const [formData, setFormData] = useState(() => {
        // Load initial form data from localStorage if available
        const savedData = localStorage.getItem("serviceFormData");
        return savedData ? JSON.parse(savedData) : {};
    });
    const [serviceData, setServiceData] = useState({});
    const [currentService, setCurrentService] = useState('obstetricHistory');
    const [showServiceForm, setShowServiceForm] = useState(false);

    // Save serviceData to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("serviceFormData", JSON.stringify(serviceData));
    }, [serviceData]);

    // Function to handle opening the service form modal
    const handleOpenServiceForm = () => {
        const savedData = localStorage.getItem("serviceFormData");
        const formData = savedData ? JSON.parse(savedData) : {}; // Fetch the saved data from localStorage

        setFormData(formData); // Set the formData in the parent state
        setShowServiceForm(true); // Open the modal to show the form
    };



    // Handle submission of service data
    const handleServiceSubmit = (formData) => {
        setServiceData((prevServiceData) => ({
            ...prevServiceData,
            [currentService]: formData,
        }));
        setShowServiceForm(false); // Close the service form modal
    };

    const handleServiceCancel = () => {
        setShowServiceForm(false);
        setConfirmingPatientStore(true); // Return to patient creation
    };

    const confirmPatientUpdate = (patient) => {
        setSelectedPatient(patient);
        setValues({
            name: patient.name,
            age: patient.age,
            hospital_id: patient.hospital_id,
            date_of_scan: patient.date_of_scan,
            gestational_age: patient.gestational_age,
            parity_gravidity: patient.parity_gravidity,
            referring_physician: patient.referring_physician,
        });
        setConfirmingPatientUpdate(true);
    };

    const confirmPatientDeletion = (patient) => {
        setSelectedPatient(patient);
        setConfirmingPatientDeletion(true);
    };

    const {delete: destroy, post, put, processing, reset} = useForm({});

    const updatePatient = (e) => {
        e.preventDefault();
        router.put(`/patients/${selectedPatient.id}/edit`, values, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                closeUpdateModal();
                fetchPatients(currentPage);
            },
            onFinish: () => reset(),
        });
    };

    const deletePatient = (e) => {
        e.preventDefault();
        destroy(route('delete-patient', {patient: selectedPatient.id}), {
            preserveScroll: true,
            onSuccess: () => {
                closeDeleteModal();
                fetchPatients(currentPage);
            },
        });
    };

    const closeUpdateModal = () => {
        setConfirmingPatientUpdate(false);
        setSelectedPatient({
            name: '',
            age: '',
            hospital_id: '',
            date_of_scan: '',
            gestational_age: '',
            parity_gravidity: '',
            referring_physician: '',
        });
        reset();
    };

    const closeDeleteModal = () => {
        setConfirmingPatientDeletion(false);
        setSelectedPatient({id: null, name: ''});
        reset();
    };

    function handleChange(e) {
        const {name, value} = e.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    }

    const submit = (e) => {
        e.preventDefault();
        const patientWithServices = {
            ...values, // Patient form data
            services: serviceData, // Service data
        };

        post(route('store-patient'), patientWithServices, {
            preserveScroll: true,
            onSuccess: () => {
                localStorage.removeItem("serviceFormData"); // Clear localStorage after submission
                setServiceData({});
                closePatientStore();
                fetchPatients(1);
            },
        });
    };

    const columns = useMemo(() => [
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Age',
            selector: (row) => row.age,
            sortable: true,
        },
        {
            name: 'Hospital ID',
            selector: (row) => row.hospital_id,
        },
        {
            name: 'Date of Scan',
            selector: (row) => row.date_of_scan,
        },
        {
            name: 'Gestational Age',
            selector: (row) => row.gestational_age,
            sortable: true,
        },
        {
            name: 'Parity Gravidity',
            selector: (row) => row.parity_gravidity,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex justify-center space-x-2">
                    <div>
                        <button
                            onClick={() => confirmPatientUpdate({
                                id: row.id,
                                name: row.name,
                                age: row.age,
                                hospital_id: row.hospital_id,
                                date_of_scan: row.date_of_scan,
                                gestational_age: row.gestational_age,
                                parity_gravidity: row.parity_gravidity,
                                referring_physician: row.referring_physician,
                            })}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
                            </svg>
                        </button>
                    </div>
                    <div>
                        <button className="text-red-600 hover:text-red-900"
                                onClick={() => confirmPatientDeletion({
                                    id: row.id,
                                    name: row.name
                                })
                        }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                            </svg>
                        </button>
                    </div>
                </div>
            ),
        }
    ], [currentPage, perPage]);

    const fetchPatients = async (page) => {
        setLoading(true);
        const response = await axios.get(`${appUrl}/api/patients?page=${page}&per_page=${perPage}`, {
            params: {
                filter: {
                    name: searchTerm,
                },
            },
        });
        setPatientData(response.data.data);
        setTotalRows(response.data.meta.total);
        setLoading(false);
    };

    const handlePageChange = (page) => fetchPatients(page);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handlePerRowsChange = async (newPerPage, page) => fetchPatients(page);

    useEffect(() => {
        fetchPatients(1);
    }, [currentPage, searchTerm, appUrl]);

    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <Head title="Patients"/>

                <div className="flex flex-col md:flex-row bg-gray-200">
                    <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center p-4">
                            <div className="md:my-0">
                                <input
                                    id="nameFilter"
                                    type="text"
                                    className="p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search for a user"
                                />
                            </div>
                            <div>
                                <button onClick={confirmPatientStore}
                                        className="w-full sm:w-24 flex justify-center items-center px-4 py-2 bg-dark-theme border border-transparent rounded-md font-extrabold text-xs dark:text-white uppercase hover:opacity-90">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <DataTable
                            title="Patients"
                            columns={columns}
                            data={patientData}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangeRowsPerPage={handlePerRowsChange}
                            onChangePage={handlePageChange}
                            progressPending={loading}
                            highlightOnHover
                        />
                    </div>
                </div>
            </AuthenticatedLayout>
            <Modal show={confirmingPatientStore} onClose={closePatientStore}>
                <form onSubmit={submit} className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Create a New Patient Record
                    </h2>

                    <div className="space-x-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                               htmlFor="name">Name</label>
                        <input onChange={(e) => setData('name', e.target.value)}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                               id="name" type="text" name="name" required autoFocus/>
                        <span className="text-red-600">{errors.name && <div>{errors.name}</div>}</span>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="email">Age
                        </label>
                        <input onChange={(e) => setData('age', e.target.value)}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                               id="age" type="number" name="age" required/>
                        <span className="text-red-600">{errors.age && <div>{errors.age}</div>}</span>
                    </div>

                    <div className="space-x-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                               htmlFor="hospital_id">Hospital ID</label>
                        <input onChange={(e) => setData('hospital_id', e.target.value)}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                               id="hospital_id" type="text" name="hospital_id" required autoFocus/>
                        <span className="text-red-600">{errors.hospital_id && <div>{errors.hospital_id}</div>}</span>
                    </div>

                    <div className="space-x-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                               htmlFor="date_of_scan">Date of Scan</label>
                        <input onChange={(e) => setData('date_of_scan', e.target.value)}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                               id="date_of_scan" type="date" name="date_of_scan" required autoFocus/>
                        <span className="text-red-600">{errors.date_of_scan && <div>{errors.date_of_scan}</div>}</span>
                    </div>

                    <div className="space-x-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                               htmlFor="gestational_age">Gestational Age</label>
                        <input onChange={(e) => setData('gestational_age', e.target.value)}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                               id="gestational_age" type="number" name="gestational_age" required autoFocus/>
                        <span className="text-red-600">{errors.gestational_age &&
                            <div>{errors.gestational_age}</div>}</span>
                    </div>

                    <div className="space-x-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                               htmlFor="parity_gravidity">Parity Gravidity</label>
                        <input onChange={(e) => setData('parity_gravidity', e.target.value)}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                               id="parity_gravidity" type="text" name="parity_gravidity" required autoFocus/>
                        <span className="text-red-600">{errors.parity_gravidity &&
                            <div>{errors.parity_gravidity}</div>}</span>
                    </div>

                    <div className="space-x-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                               htmlFor="referring_physician">Referring Physician</label>
                        <input onChange={(e) => setData('referring_physician', e.target.value)}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                               id="referring_physician" type="text" name="referring_physician" required autoFocus/>
                        <span className="text-red-600">{errors.referring_physician &&
                            <div>{errors.referring_physician}</div>}</span>
                    </div>

                    <div className="space-x-2">
                        <SecondaryButton onClick={handleOpenServiceForm}
                            // onClick={() => {
                            // setCurrentService('obstetricHistory');
                            // setShowServiceForm(true);

                        >
                            Add Service
                        </SecondaryButton>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closePatientStore}>Cancel</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Add Patient
                        </PrimaryButton>
                    </div>

                </form>
            </Modal>
            <Modal show={confirmingPatientUpdate} onClose={closeUpdateModal}>

                <form onSubmit={updatePatient} className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Update {selectedPatient.name}?
                    </h2>

                    {/* Grid container */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-x-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                   htmlFor="title">Name:</label>
                            <input
                                id="name"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                            />
                            <span className="text-red-600">{errors.name &&
                                <div>{errors.name}</div>}</span>
                        </div>


                        <div className="space-x-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                   htmlFor="title">Age:</label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                value={values.age}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                            />
                            <span className="text-red-600">{errors.age &&
                                <div>{errors.age}</div>}</span>
                        </div>

                        <div className="space-x-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                   htmlFor="title">Hospital ID:</label>
                            <input
                                id="hospital_id"
                                name="hospital_id"
                                value={values.hospital_id}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                            />
                            <span className="text-red-600">{errors.hospital_id &&
                                <div>{errors.hospital_id}</div>}</span>
                        </div>

                        <div className="space-x-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                   htmlFor="title">Date of Scan:</label>
                            <input
                                id="date_of_scan"
                                name="date_of_scan"
                                value={values.date_of_scan}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                            />
                            <span className="text-red-600">{errors.date_of_scan &&
                                <div>{errors.date_of_scan}</div>}</span>
                        </div>

                        <div className="space-x-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                   htmlFor="title">Gestational Age:</label>
                            <input
                                id="gestational_age"
                                name="gestational_age"
                                value={values.gestational_age}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                            />
                            <span className="text-red-600">{errors.gestational_age &&
                                <div>{errors.gestational_age}</div>}</span>
                        </div>

                        <div className="space-x-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                   htmlFor="title">Parity Gravidity:</label>
                            <input
                                id="parity_gravidity"
                                name="parity_gravidity"
                                value={values.parity_gravidity}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                            />
                            <span className="text-red-600">{errors.parity_gravidity &&
                                <div>{errors.parity_gravidity}</div>}</span>
                        </div>

                        <div className="space-x-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                   htmlFor="title">Referring Physician:</label>
                            <input
                                id="referring_physician"
                                name="referring_physician"
                                value={values.referring_physician}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                            />
                            <span className="text-red-600">{errors.referring_physician &&
                                <div>{errors.referring_physician}</div>}</span>
                        </div>


                    </div>
                    {/*End of Grid*/}

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeUpdateModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Update
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
            <Modal show={confirmingPatientDeletion} onClose={closeDeleteModal}>
                <form onSubmit={deletePatient} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Are you sure you want to delete {selectedPatient.name}?
                    </h2>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeDeleteModal}>Cancel</SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Delete Patient Record
                        </DangerButton>
                    </div>
                </form>
            </Modal>
            {/* Modal for adding service */}
            <Modal show={showServiceForm} onClose={() => setShowServiceForm(false)}>
                <ServiceFormComponent
                    initialServiceType="obstetricHistory"  // or another default service type
                    formData={formData}                    // Pass the stored formData
                    onSubmit={handleServiceSubmit}
                    onCancel={handleServiceCancel}
                />
            </Modal>
        </>
    );
}

Patient.layout = (page) => <ParentLayout children={page}/>
export default Patient;
