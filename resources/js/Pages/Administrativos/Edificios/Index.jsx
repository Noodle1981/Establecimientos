import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useMemo, useRef, useState } from 'react';
import CreateEdificioModal from './Partials/CreateEdificioModal';
import EdificiosFilters from './Partials/EdificiosFilters';
import EdificiosTable from './Partials/EdificiosTable';
import EditEdificioModal from './Partials/EditEdificioModal';
import ViewEdificioModal from './Partials/ViewEdificioModal';

export default function Index({ edificios, filters, options }) {
    const [search, setSearch] = useState(filters.search || '');
    const [searchCui, setSearchCui] = useState(filters.search_cui || '');
    const [selectedEdificio, setSelectedEdificio] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Refs to capture latest search values for the debounced callback
    const searchRef = useRef(search);
    const searchCuiRef = useRef(searchCui);
    searchRef.current = search;
    searchCuiRef.current = searchCui;

    // Filter handling
    const applyFilters = useMemo(
        () =>
            debounce(() => {
                router.get(
                    route('administrativos.edificios.index'),
                    {
                        ...filters,
                        search: searchRef.current,
                        search_cui: searchCuiRef.current,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                );
            }, 300),
        [filters],
    );

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        searchRef.current = val;
        applyFilters();
    };

    const handleSearchCui = (e) => {
        const val = e.target.value;
        setSearchCui(val);
        searchCuiRef.current = val;
        applyFilters();
    };

    const handleParamChange = (key, value) => {
        router.get(
            route('administrativos.edificios.index'),
            { ...filters, [key]: value },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSort = (field) => {
        const direction =
            filters.sort_by === field && filters.sort_dir === 'asc'
                ? 'desc'
                : 'asc';
        router.get(
            route('administrativos.edificios.index'),
            {
                ...filters,
                sort_by: field,
                sort_dir: direction,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Modal Handlers
    const openEdit = (edificio) => {
        setSelectedEdificio(edificio);
        setShowEditModal(true);
    };

    const openView = (edificio) => {
        setSelectedEdificio(edificio);
        setShowViewModal(true);
    };

    const handleDelete = (id) => {
        if (
            confirm(
                '¿Está seguro de que desea eliminar este edificio? Se trasladará a la papelera de reciclaje.',
            )
        ) {
            router.delete(route('administrativos.edificios.destroy', id), {
                onError: (errors) => {
                    if (errors.error) {
                        alert(errors.error);
                    }
                },
            });
        }
    };

    return (
        <>
            <Head title="Edificios" />

            <div className="space-y-6">
                {/* Filters & Actions Bar */}
                <EdificiosFilters
                    searchCui={searchCui}
                    onSearchCuiChange={handleSearchCui}
                    search={search}
                    onSearchChange={handleSearch}
                    filters={filters}
                    options={options}
                    onParamChange={handleParamChange}
                    totalCount={edificios.total}
                    onOpenCreateModal={() => setShowCreateModal(true)}
                />

                {/* Table */}
                <EdificiosTable
                    edificios={edificios}
                    filters={filters}
                    onSort={handleSort}
                    onView={openView}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Modals */}
            <ViewEdificioModal
                show={showViewModal}
                onClose={() => setShowViewModal(false)}
                edificio={selectedEdificio}
            />
            <EditEdificioModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                edificio={selectedEdificio}
                options={options}
            />
            <CreateEdificioModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                options={options}
            />
        </>
    );
}

Index.layout = (page) => <AuthenticatedLayout header={null}>{page}</AuthenticatedLayout>;
