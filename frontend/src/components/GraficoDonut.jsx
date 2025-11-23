import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ["#27ae60", "#2980b9", "#e67e22", "#7f8c8d"];

export default function GraficoDonut({ data }) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}