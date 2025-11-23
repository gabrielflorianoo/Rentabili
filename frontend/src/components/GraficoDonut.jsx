import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#27ae60', '#2980b9', '#e67e22', '#7f8c8d'];

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
                // Adiciona a prop 'labelLine={false}' e 'label' aqui se quiser mostrar rótulos nos dados
                >
                    {data.map((_, index) => (
                        <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                {/* ADICIONA A LEGENDA AQUI 
                  A prop 'layout="vertical"' e 'verticalAlign="middle"' são comuns para gráficos de rosca
                */}
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                />
            </PieChart>
        </ResponsiveContainer>
    );
}