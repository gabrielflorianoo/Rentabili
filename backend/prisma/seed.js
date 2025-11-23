import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; 

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed do banco de dados...");

    //Limpeza de Dados
    await prisma.historicalBalance.deleteMany();
    await prisma.active.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Dados antigos limpos.");

    //Criação de um Usuário Investidor (dateOfBirth removido)
    const passwordHash = await bcrypt.hash("investidor123", 10);
    const investorEmail = "investidor@exemplo.com";
    
    const investor = await prisma.user.create({
        data: {
            name: "Ana Investidora",
            email: investorEmail,
            password: passwordHash,
            phone: "43987654321",
        },
    });

    console.log(`👤 Usuário criado: ${investor.name} (${investor.email})`);

    //Criação dos Ativos do Usuário
    const cdbActive = await prisma.active.create({
        data: { name: "CDB Banco Seguro 120%", type: "CDB", userId: investor.id },
    });
    const fundActive = await prisma.active.create({
        data: { name: "Fundo Multi Alpha", type: "Fundo de Investimento", userId: investor.id },
    });
    const stockActive = await prisma.active.create({
        data: { name: "Ação Tech S.A. (TSA3)", type: "Ação", userId: investor.id },
    });

    console.log(`💰 3 Ativos de exemplo criados: ${cdbActive.name}, ${fundActive.name}, ${stockActive.name}`);

    //Criação dos Saldos Históricos
    const historicalBalancesData = [

        { activeId: cdbActive.id, date: new Date("2025-01-31"), value: 10000.00 },
        { activeId: cdbActive.id, date: new Date("2025-02-28"), value: 10080.00 },
        { activeId: cdbActive.id, date: new Date("2025-03-31"), value: 10165.00 },

        { activeId: fundActive.id, date: new Date("2025-01-31"), value: 50000.00 },
        { activeId: fundActive.id, date: new Date("2025-02-28"), value: 50450.00 },
        { activeId: fundActive.id, date: new Date("2025-03-31"), value: 51200.00 },

        { activeId: stockActive.id, date: new Date("2025-01-31"), value: 20000.00 },
        { activeId: stockActive.id, date: new Date("2025-02-28"), value: 19500.00 }, 
        { activeId: stockActive.id, date: new Date("2025-03-31"), value: 20300.00 }, 
    ];

    await prisma.historicalBalance.createMany({
        data: historicalBalancesData.map(balance => ({
            activeId: balance.activeId,
            date: balance.date,
            value: balance.value, 
        }))
    });

    console.log(`📈 ${historicalBalancesData.length} registros de saldos históricos criados para cálculo de performance.`);

    console.log("🎉 Seed concluído com sucesso!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });