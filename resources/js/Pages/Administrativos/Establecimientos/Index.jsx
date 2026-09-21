import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import CreateModalidadModal from './Partials/CreateModalidadModal';
import EditModalidadModal from './Partials/EditModalidadModal';
import EstablecimientosFilters from './Partials/EstablecimientosFilters';
import EstablecimientosTable from './Partials/EstablecimientosTable';
import ViewModalidadModal from './Partials/ViewModalidadModal';

export default function Index({
    modalidades,
    filters,
    options,
    nombresEdificios = {},
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedModalidad, setSelectedModalidad] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Filter handling with debounce
    const applyFilters = useMemo(
        () =>
            debounce((query) => {
                const newFilters = { ...filters, search: query };
                delete newFilters.page;
                router.get(
                    route('administrativos.establecimientos.index'),
                    newFilters,
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
        setSearch(e.target.value);
        applyFilters(e.target.value);
    };

    const filteredRadios = useMemo(() => {
        if (!filters.zona_departamento) {
            return options.radios || [];
        }
        return options.departamento_radios?.[filters.zona_departamento] || [];
    }, [
        filters.zona_departamento,
        options.radios,
        options.departamento_radios,
    ]);

    const filteredCategorias = useMemo(() => {
        if (!filters.zona_departamento) {
            return options.categorias || [];
        }
        return (
            options.departamento_categorias?.[filters.zona_departamento] || []
        );
    }, [
        filters.zona_departamento,
        options.categorias,
        options.departamento_categorias,
    ]);

    const handleZonaDepartamentoChange = (newDepto) => {
        const newFilters = { ...filters, zona_departamento: newDepto };
        delete newFilters.page;

        if (newDepto && filters.radio) {
            const validRadios = options.departamento_radios?.[newDepto] || [];
            if (!validRadios.includes(filters.radio)) {
                delete newFilters.radio;
            }
        }

        if (newDepto && filters.categoria) {
            const validCategorias =
                options.departamento_categorias?.[newDepto] || [];
            if (!validCategorias.includes(filters.categoria)) {
                delete newFilters.categoria;
            }
        }

        router.get(
            route('administrativos.establecimientos.index'),
            newFilters,
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleParamChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        delete newFilters.page;
        router.get(
            route('administrativos.establecimientos.index'),
            newFilters,
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const resetFilters = () => {
        router.get(route('administrativos.establecimientos.index'), {});
    };

    const handleDelete = (item) => {
        const hasOnlyOneModalidad =
            item.establecimiento?.modalidades_count === 1;

        let confirmMessage =
            '¿Está seguro de que desea dar de baja esta modalidad escolar? Se trasladará a la papelera de reciclaje.';
        if (hasOnlyOneModalidad) {
            confirmMessage =
                '⚠️ ¡ATENCIÓN! Esta es la ÚLTIMA modalidad activa de este establecimiento. Si la elimina, el ESTABLECIMIENTO COMPLETO (CUE: ' +
                item.establecimiento.cue +
                ') se dará de baja automáticamente. ¿Desea continuar?';
        }

        if (confirm(confirmMessage)) {
            router.delete(
                route('administrativos.establecimientos.destroy', item.id),
            );
        }
    };

    const handleOpenView = (item) => {
        setSelectedModalidad(item);
        setShowViewModal(true);
    };

    const handleOpenEdit = (item) => {
        setSelectedModalidad(item);
        setShowEditModal(true);
    };

    return (
        <>
            <Head title="Establecimientos" />

            <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-4">
                {/* Actions & Filters Sidebar */}
                <EstablecimientosFilters
                    search={search}
                    onSearchChange={handleSearch}
                    filters={filters}
                    options={options}
                    filteredRadios={filteredRadios}
                    filteredCategorias={filteredCategorias}
                    onParamChange={handleParamChange}
                    onZonaDepartamentoChange={handleZonaDepartamentoChange}
                    onResetFilters={resetFilters}
                    totalCount={modalidades.total}
                    onOpenCreateModal={() => setShowCreateModal(true)}
                />

                {/* Table Content */}
                <EstablecimientosTable
                    modalidades={modalidades}
                    nombresEdificios={nombresEdificios}
                    onView={handleOpenView}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onResetFilters={resetFilters}
                />
            </div>

            {/* Modals */}
            <ViewModalidadModal
                show={showViewModal}
                onClose={() => setShowViewModal(false)}
                modalidad={selectedModalidad}
                nombresEdificios={nombresEdificios}
            />
            <EditModalidadModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                modalidad={selectedModalidad}
                options={options}
                nombresEdificios={nombresEdificios}
            />
            <CreateModalidadModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                options={options}
            />
        </>
    );
}

Index.layout = (page) => <AuthenticatedLayout header={null}>{page}</AuthenticatedLayout>;
