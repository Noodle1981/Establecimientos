export default function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-brand-orange">
                <i className={icon}></i>
            </div>
            <div>
                <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-black/40">
                    {label}
                </p>
                <p className="text-sm font-black leading-tight text-black">
                    {value}
                </p>
            </div>
        </div>
    );
}
