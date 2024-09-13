import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, totalUsers, totalPatients }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Total Users Card */}
                        <Link href="/users" className="transform hover:scale-105 transition-transform duration-300">
                            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                                            Total Users
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {totalUsers}
                                        </div>
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M19 3v4M12 3v4M12 12v9M7 16l5-5 5 5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Total Patients Card */}
                        <Link href="/patients" className="transform hover:scale-105 transition-transform duration-300">
                            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                                            Total Patients
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {totalPatients}
                                        </div>
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12v8m-6-6v-6M18 12v-6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Active Sessions Card */}
                        {/*<Link href="/sessions" className="transform hover:scale-105 transition-transform duration-300">*/}
                            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                                            {/*Active Sessions*/}
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {/*57 /!* This value can be dynamic *!/*/}
                                        </div>
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h18M3 9h18m-9 8h9" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        {/*</Link>*/}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
