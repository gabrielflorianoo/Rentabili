let prismaInstance = null;

async function getPrismaClient() {
    // Se já temos uma instância, retorna ela
    if (prismaInstance !== null) {
        return prismaInstance;
    }

    // Se USE_DB não está true, retorna null (modo mock)
    if (process.env.USE_DB !== 'true') {
        console.log('⚠️  [Prisma] USE_DB não está true, usando modo MOCK');
        prismaInstance = null;
        return null;
    }

    console.log('🔍 [Prisma] USE_DB está true, inicializando Prisma Client...');

    // Importação dinâmica do PrismaClient
    const { PrismaClient } = await import('@prisma/client');

    // Singleton pattern para desenvolvimento (evita múltiplas instâncias no hot-reload)
    if (process.env.NODE_ENV === 'production') {
        prismaInstance = new PrismaClient();
        console.log('✅ [Prisma] Prisma Client criado (PRODUCTION)');
    } else {
        // Em desenvolvimento, usa global para manter singleton
        if (!global.__prisma) {
            global.__prisma = new PrismaClient();
            console.log('✅ [Prisma] Prisma Client criado (DEVELOPMENT)');
        }
        prismaInstance = global.__prisma;
    }

    return prismaInstance;
}

// Exporta a função que retorna a instância
export default getPrismaClient;