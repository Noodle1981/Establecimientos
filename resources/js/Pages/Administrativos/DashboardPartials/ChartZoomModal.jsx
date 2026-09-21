import Modal from '@/Components/Modal';
import { Bar, Doughnut } from 'react-chartjs-2';

export default function ChartZoomModal({ modalChart, onClose }) {
    return (
        <Modal
            show={!!modalChart}
            onClose={onClose}
            maxWidth="4xl"
        >
            {modalChart && (
                <div className="p-8">
                    <div className="mb-8 flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-2 rounded-full bg-brand-orange"></div>
                            <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">
                                {modalChart.title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-500"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="h-[500px] w-full">
                        {modalChart.type === 'doughnut' ? (
                            <Doughnut
                                data={modalChart.data}
                                options={{
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                            labels: {
                                                boxWidth: 15,
                                                font: {
                                                    size: 12,
                                                    weight: 'bold',
                                                },
                                                padding: 20,
                                            },
                                        },
                                        tooltip: {
                                            padding: 15,
                                            titleFont: {
                                                size: 14,
                                                weight: 'black',
                                            },
                                            bodyFont: { size: 13 },
                                        },
                                    },
                                    maintainAspectRatio: false,
                                }}
                            />
                        ) : (
                            <Bar
                                data={modalChart.data}
                                options={{
                                    indexAxis: modalChart.horizontal
                                        ? 'y'
                                        : 'x',
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                            labels: {
                                                font: {
                                                    size: 12,
                                                    weight: 'bold',
                                                },
                                            },
                                        },
                                        tooltip: {
                                            padding: 15,
                                            titleFont: {
                                                size: 14,
                                                weight: 'black',
                                            },
                                            bodyFont: { size: 13 },
                                        },
                                    },
                                    scales: {
                                        x: {
                                            grid: { display: false },
                                            ticks: {
                                                font: {
                                                    size: 11,
                                                    weight: 'bold',
                                                },
                                            },
                                        },
                                        y: {
                                            grid: { color: '#f3f4f6' },
                                            ticks: { font: { size: 11 } },
                                        },
                                    },
                                    maintainAspectRatio: false,
                                }}
                            />
                        )}
                    </div>

                    <div className="mt-8 flex items-center gap-4 rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-orange shadow-sm">
                            <i className="fas fa-info-circle"></i>
                        </div>
                        <p className="text-xs font-bold leading-relaxed text-gray-600">
                            Esta vista detallada muestra los valores exactos y
                            leyendas completas. Puedes usar los filtros del
                            panel principal para actualizar los datos de este
                            gráfico en tiempo real.
                        </p>
                    </div>
                </div>
            )}
        </Modal>
    );
}
