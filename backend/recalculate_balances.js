// Script para recalcular os balances históricos baseado nos investimentos
import getPrismaClient from './prismaClient.js';

const prisma = getPrismaClient();

async function recalculateBalances() {
    try {
        console.log('🔄 Iniciando recálculo de balances históricos...\n');

        // Buscar todos os investimentos agrupados por ativo e data
        const investments = await prisma.investment.findMany({
            orderBy: [
                { activeId: 'asc' },
                { date: 'asc' }
            ],
            include: {
                active: true
            }
        });

        console.log(`📊 Total de investimentos encontrados: ${investments.length}\n`);

        // Agrupar por ativo
        const investmentsByActive = {};
        investments.forEach(inv => {
            if (!investmentsByActive[inv.activeId]) {
                investmentsByActive[inv.activeId] = {
                    activeName: inv.active.name,
                    investments: []
                };
            }
            investmentsByActive[inv.activeId].investments.push(inv);
        });

        console.log(`📦 Ativos com investimentos: ${Object.keys(investmentsByActive).length}\n`);

        // Para cada ativo, calcular saldos acumulados
        for (const [activeId, data] of Object.entries(investmentsByActive)) {
            const { activeName, investments } = data;
            console.log(`\n💼 Processando: ${activeName} (ID: ${activeId})`);
            console.log(`   Total de transações: ${investments.length}`);

            // Agrupar por data
            const balancesByDate = {};
            let saldoAcumulado = 0;

            investments.forEach(inv => {
                const dateKey = new Date(inv.date).toISOString().split('T')[0];
                const amount = Number(inv.amount);

                // Acumular o saldo
                saldoAcumulado += amount;

                // Guardar o saldo naquela data (sobrescrever se já existe)
                balancesByDate[dateKey] = saldoAcumulado;

                console.log(`   ${dateKey}: ${inv.kind} = R$ ${amount.toFixed(2)} → Saldo: R$ ${saldoAcumulado.toFixed(2)}`);
            });

            // Agora criar/atualizar os HistoricalBalances
            for (const [dateKey, balance] of Object.entries(balancesByDate)) {
                const date = new Date(dateKey);
                
                try {
                    // Tentar atualizar ou criar
                    await prisma.historicalBalance.upsert({
                        where: {
                            activeId_date: {
                                activeId: parseInt(activeId),
                                date: date
                            }
                        },
                        update: {
                            value: balance
                        },
                        create: {
                            activeId: parseInt(activeId),
                            date: date,
                            value: balance
                        }
                    });
                } catch (error) {
                    console.error(`   ❌ Erro ao salvar balance para ${dateKey}:`, error.message);
                }
            }

            console.log(`   ✅ Saldo final do ativo: R$ ${saldoAcumulado.toFixed(2)}`);
        }

        console.log('\n✅ Recálculo concluído com sucesso!');
        
        // Mostrar resumo
        const totalBalances = await prisma.historicalBalance.count();
        console.log(`\n📈 Total de balances históricos no banco: ${totalBalances}`);

    } catch (error) {
        console.error('❌ Erro durante o recálculo:', error);
    } finally {
        await prisma.$disconnect();
    }
}

recalculateBalances();
