# Diagnóstico do Dashboard - Rentabilidade Incorreta

## Problema Identificado
- **Rentabilidade exibida:** +90.95% (R$ 78.860,01 de lucro)
- **Rentabilidade esperada:** ~10.22% (R$ 8.860,01 de lucro)
- **Discrepância:** O patrimônio total está sendo calculado como ~R$ 165.565,80 ao invés de R$ 95.565,80

## Passos para Diagnosticar

### 1. Verifique os investimentos no banco de dados

Acesse o endpoint de debug:
```bash
curl -X GET http://localhost:3000/dashboard/debug \
  -H "Authorization: Bearer <seu_token_jwt>"
```

Isso retornará:
```json
{
  "totalInvestments": "<número total>",
  "byKind": {
    "Investimento": { "count": "...", "total": "..." },
    "Renda": { "count": "...", "total": "..." }
  },
  "totalAll": "...",
  "totalWithoutRenda": "...",
  "investments": [
    { "id": 1, "active": "CDB Banco Seguro 120%", "amount": 10000, "kind": "Investimento", "date": "..." },
    ...
  ]
}
```

### 2. Procure por:

- **Investimentos duplicados:** Mesmo ID, data, ou combinação ativo+data+valor
- **Valores errados:** Compare com o que você vê na tabela do frontend
- **Contagem errada:** Deveria ter 5 investimentos + 5 rendas = 10 total

### 3. Possíveis causas:

1. **Investimentos duplicados no banco:** 
   - Execute: `SELECT id, COUNT(*) FROM "Investment" WHERE "userId" = <seu_id> GROUP BY id HAVING COUNT(*) > 1;`

2. **Valores sendo multiplicados por 2:**
   - Total esperado: R$ 95.565,80
   - Total recebido: R$ 165.565,80
   - Razão: ~1.73x (parece que há algo sendo somado extras)

3. **Rendas sendo contadas como investimentos:**
   - Verifique se as rendas têm `kind = 'Renda'`

### 4. Se encontrar duplicatas:

Delete as duplicatas:
```sql
DELETE FROM "Investment" 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY "activeId", "date", "amount", "kind", "userId" 
      ORDER BY id
    ) as rn FROM "Investment"
  ) t WHERE rn > 1
);
```

### 5. Verifique o cache:

Se tudo parecer correto mas ainda estiver errado, limpe o cache:
```bash
# Envie uma request com cache bypass
curl -X GET "http://localhost:3000/dashboard/dashboard?nocache=true" \
  -H "Authorization: Bearer <seu_token_jwt>"
```

## Próximos passos:
1. Execute o diagnóstico acima
2. Compartilhe os resultados do endpoint `/dashboard/debug`
3. Se encontrar duplicatas, execute o DELETE acima
4. Recarregue a página do dashboard
