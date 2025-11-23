import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function GraficoLinha({ data }) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#2ecc71"
                    strokeWidth={3}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
