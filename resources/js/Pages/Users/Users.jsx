import ParentLayout from '@/Layouts/ParentLayout';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import React, {useEffect, useMemo, useState, FormEventHandler} from "react";
import DataTable from 'react-data-table-component';
import {Head, usePage, useForm, router} from "@inertiajs/react";
import Modal from "@/Components/Modal.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";

const Users = ({auth}) => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const {appUrl, errors} = usePage().props;
    const [confirmingUserStore, setConfirmingUserStore] = useState(false);
    const closeUserStore = () => setConfirmingUserStore(false);
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [confirmingUserUpdate, setConfirmingUserUpdate] = useState(false);
    const [selectedUser, setSelectedUser] = useState({
        id: null,
        name: '',
        email: '',
        type: '',
        company_id: ''
    });
    const [values, setValues] = useState({
        id: selectedUser.id || "",
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        type: selectedUser.type || "",
    })
    const userTypeMapping = {
        'App\\Models\\SuperAdmin': 'SuperAdmin',
        'App\\Models\\RegularUser': 'RegularUser',
    };

    const reverseTypeMapping = {
        'Super Admin': 'App\\Models\\SuperAdmin',
        'Regular User': 'App\\Models\\RegularUser',
    };


    // Sort userTypeMapping to put values.type at the beginning
    const sortedUserTypeMapping = () => {
        const sortedMapping = {};
        if (values.type && userTypeMapping[values.type]) {
            sortedMapping[values.type] = userTypeMapping[values.type];
        }

        // Add the rest of the types to the sorted mapping
        Object.entries(userTypeMapping).forEach(([key, value]) => {
            if (key !== values.type) {
                sortedMapping[key] = value;
            }
        });

        return sortedMapping;
    };


    const confirmUserStore = () => setConfirmingUserStore(true);
    const {data, setData, post, recentlySuccessful} = useForm({
        name: '',
        email: '',
        password: '',
        type: '',
    });
    const confirmUserUpdate = (user) => {
        // @ts-ignore
        setSelectedUser(user);

        console.log('selected user type: ', user.type);
        console.log('selected user name: ', user.name);
        setValues({
            name: user.name,
            email: user.email,
            type: user.type,
        });
        setConfirmingUserUpdate(true);
    }
    const confirmUserDeletion = (user) => {
        // @ts-ignore
        setSelectedUser(user);
        setConfirmingUserDeletion(true);
    };

    const {
        delete: destroy,
        patch,
        put,
        processing,
        reset
    } = useForm({});

    function handleChange(e) {
        const {name, value} = e.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    }

    const updateUser = (e) => {
        e.preventDefault();
        const typeQualifiedName = values.type; // The correct model class is already stored in values.type
        router.put(`/users/${selectedUser.id}/edit`, {
            name: values.name,
            email: values.email,
            type: typeQualifiedName, // Send the correct type
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                closeUpdateModal();
                fetchUsers(currentPage);
            },
            onFinish: () => reset()
        });
    };


    const deleteUser = (e) => {
        e.preventDefault();
        console.log('user_id: ', selectedUser.id);

        // After the delete action
        destroy(route('delete-user', {user: selectedUser.id}), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                closeDeleteModal();
                fetchUsers(currentPage);
            },
            onFinish: () => reset(),
        });
    };

    const closeDeleteModal = () => {
        setConfirmingUserDeletion(false);
        setSelectedUser({id: null, name: '', email: '', type: ''});
        reset();
    };

    const closeUpdateModal = () => {
        setConfirmingUserUpdate(false);
        setSelectedUser({id: null, name: '', email: '', type: ''});
        reset();
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('store-user'), {
            preserveScroll: true,
            onSuccess: () => {
                closeUserStore();
                fetchUsers(1);
            }
        })
    };

    const columns = useMemo(() => [
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true
        },
        {
            name: 'Type',
            selector: (row) => row.type,
        },
        {
            name: 'Date Created',
            selector: (row) => row.created_at
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex justify-center space-x-2">
                    <div>
                        <button
                            onClick={() => confirmUserUpdate({
                                id: row.id,
                                name: row.name,
                                phone: row.phone,
                                email: row.email,
                                nationalid: row.nationalid,
                                gtaccount: row.gtaccount,
                                mobilewallet: row.mobilewallet,
                                digitaladdress: row.digitaladdress,
                                type: row.type,
                                company_id: row.company_id
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
                                onClick={() => confirmUserDeletion({id: row.id, name: row.name})}
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

    const fetchUsers = async (page) => {
        try {
            setLoading(true);
            const response = await axios.get(`${appUrl}/api/users?page=${page}&per_page=${perPage}`, {
                params: {
                    filter: {
                        name: searchTerm
                    }
                }
            });

            console.log('all users: ', response.data);
            setUserData(response.data.data);
            setTotalRows(response.data.meta.total);
            setLoading(false);
        } catch (error) {
            console.error('Fetch Users failed: ', error);
        }
    }

    const handlePageChange = (page) => {
        fetchUsers(page);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        const response = await axios.get(`${appUrl}/api/users?page=${page}&per_page=${newPerPage}`);
        setUserData(response.data.data);
        setPerPage(newPerPage);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers(1);
    }, [currentPage, searchTerm, appUrl]);


    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <Head title="Users"/>

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
                                <button onClick={confirmUserStore}
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
                            title="Users"
                            columns={columns}
                            data={userData}
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
            <Modal show={confirmingUserStore} onClose={closeUserStore}>
                <form onSubmit={submit} className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Create a New User
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="email">Email
                            Address</label>
                        <input onChange={(e) => setData('email', e.target.value)}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                               id="email" type="email" name="email" required/>
                        <span className="text-red-600">{errors.email && <div>{errors.email}</div>}</span>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                               htmlFor="password">Password</label>
                        <input onChange={(e) => setData('password', e.target.value)}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                               id="password" type="password" name="password" required
                               autoComplete="new-password"/>
                        <span className="text-red-600">{errors.password &&
                            <div>{errors.password}</div>}</span>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                               htmlFor="type">Type</label>
                        <select
                            id="type"
                            name="type"
                            required
                            onChange={(e) => setData('type', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                        >
                            <option selected disabled value="">Select User Type</option>
                            <option value="App\Models\SuperAdmin">Super Admin</option>
                            <option value="App\Models\RegularUser">Regular User</option>
                        </select>
                        <span className="text-red-600">{errors.type && <div>{errors.type}</div>}</span>
                    </div>


                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeUpdateModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Create User
                        </PrimaryButton>
                    </div>

                </form>
            </Modal>
            <Modal show={confirmingUserUpdate} onClose={closeUpdateModal}>
                <form onSubmit={updateUser} className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Update {selectedUser.name}?
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
                                   htmlFor="title">Email Address:</label>
                            <input
                                id="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                            />
                            <span className="text-red-600">{errors.email &&
                                <div>{errors.email}</div>}</span>
                        </div>

                        <div className="space-x-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="type">Type:</label>
                            <select
                                id="type"
                                name="type"
                                value={values.type} // Controlled component approach
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-300 sm:text-sm"
                            >
                                {/* Dynamically render options based on the current value */}
                                {values.type === 'Super Admin' ? (
                                    <>
                                        <option value="Super Admin">Super Admin</option>
                                        <option value="Regular User">Regular User</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Regular User">Regular User</option>
                                        <option value="Super Admin">Super Admin</option>
                                    </>
                                )}
                            </select>
                            <span className="text-red-600">{errors.type && <div>{errors.type}</div>}</span>
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
            <Modal show={confirmingUserDeletion} onClose={closeDeleteModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Are you sure you want to delete {selectedUser.name}?
                    </h2>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeDeleteModal}>Cancel</SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Delete User
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}

Users.layout = (page) => <ParentLayout children={page}/>
export default Users;
