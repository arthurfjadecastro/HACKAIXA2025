const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function updateCoverageReadme() {
  try {
    // Executar Jest com coverage e capturar output
    const jestOutput = execSync('npx jest --coverage --silent', { encoding: 'utf8', cwd: path.join(__dirname, '..') });
    
    // Extrair métricas do output do Jest
    const summaryMatch = jestOutput.match(/=============================== Coverage summary ===============================\s*Statements\s*:\s*([\d.]+)%\s*\(\s*(\d+)\/(\d+)\s*\)\s*Branches\s*:\s*([\d.]+)%\s*\(\s*(\d+)\/(\d+)\s*\)\s*Functions\s*:\s*([\d.]+)%\s*\(\s*(\d+)\/(\d+)\s*\)\s*Lines\s*:\s*([\d.]+)%\s*\(\s*(\d+)\/(\d+)\s*\)/);
    
    if (!summaryMatch) {
      throw new Error('Could not extract coverage summary from Jest output');
    }

    const total = {
      statements: {
        pct: summaryMatch[1],
        covered: parseInt(summaryMatch[2]),
        total: parseInt(summaryMatch[3])
      },
      branches: {
        pct: summaryMatch[4],
        covered: parseInt(summaryMatch[5]),
        total: parseInt(summaryMatch[6])
      },
      functions: {
        pct: summaryMatch[7],
        covered: parseInt(summaryMatch[8]),
        total: parseInt(summaryMatch[9])
      },
      lines: {
        pct: summaryMatch[10],
        covered: parseInt(summaryMatch[11]),
        total: parseInt(summaryMatch[12])
      }
    };

    // Extrair informações de teste do output mais específico
    // Buscar as linhas que mostram os resultados finais dos testes
    const lines = jestOutput.split('\n');
    let testInfo = { passed: 0, failed: 0, total: 0 };
    
    // Procurar por linhas como "Tests:       19 passed, 19 total"
    for (const line of lines) {
      if (line.includes('Tests:') && line.includes('passed')) {
        const testMatch = line.match(/Tests:\s*(\d+)\s*passed(?:,\s*(\d+)\s*failed)?(?:,\s*(\d+)\s*total)?/);
        if (testMatch) {
          testInfo.passed = parseInt(testMatch[1]) || 0;
          testInfo.failed = parseInt(testMatch[2]) || 0;
          testInfo.total = parseInt(testMatch[3]) || (testInfo.passed + testInfo.failed);
          break;
        }
      }
    }

    // Obter informações do Git
    const gitBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const gitCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    
    // Timestamp atual
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Determinar status da cobertura
    const getStatus = (pct) => {
      const num = parseFloat(pct);
      if (num >= 90) return '🟢 Excellent';
      if (num >= 80) return '🟡 Good';
      if (num >= 70) return '🟠 Fair';
      return '🔴 Needs Improvement';
    };

    // Gerar entry do histórico
    const newEntry = `
### ${timestamp} | Branch: ${gitBranch} | Commit: ${gitCommit}

| Metric | Coverage | Status |
|--------|----------|--------|
| **Statements** | ${total.statements.pct}% (${total.statements.covered}/${total.statements.total}) | ${getStatus(total.statements.pct)} |
| **Branches** | ${total.branches.pct}% (${total.branches.covered}/${total.branches.total}) | ${getStatus(total.branches.pct)} |
| **Functions** | ${total.functions.pct}% (${total.functions.covered}/${total.functions.total}) | ${getStatus(total.functions.pct)} |
| **Lines** | ${total.lines.pct}% (${total.lines.covered}/${total.lines.total}) | ${getStatus(total.lines.pct)} |

**Test Results:** ${testInfo.passed} passed, ${testInfo.failed} failed (${testInfo.total} total)

---
`;

    // Caminho do arquivo de cobertura
    const readmePath = path.join(__dirname, '../TEST-COVERAGE.md');

    let historyContent = '';

    // Se arquivo existe, lê o conteúdo atual e extrai histórico
    if (fs.existsSync(readmePath)) {
      const existingContent = fs.readFileSync(readmePath, 'utf8');
      
      // Separa header do histórico existente
      const historyStart = existingContent.indexOf('## Coverage History');
      if (historyStart !== -1) {
        const historySection = existingContent.substring(historyStart + '## Coverage History'.length);
        
        // Remove apenas a primeira entrada (mais recente) mas mantém o resto
        const entries = historySection.split('### ').filter(entry => entry.trim());
        if (entries.length > 1) {
          // Reconstrói o histórico sem a primeira entrada
          historyContent = entries.slice(1).map(entry => '### ' + entry).join('');
        }
      }
    }

    // Template do README
    const content = `# 📊 Test Coverage Report

## Current Status (Last Updated: ${timestamp})

| Metric | Coverage | Target | Status |
|--------|----------|---------|--------|
| **Statements** | **${total.statements.pct}%** | 80% | ${getStatus(total.statements.pct)} |
| **Branches** | **${total.branches.pct}%** | 70% | ${getStatus(total.branches.pct)} |
| **Functions** | **${total.functions.pct}%** | 80% | ${getStatus(total.functions.pct)} |
| **Lines** | **${total.lines.pct}%** | 80% | ${getStatus(total.lines.pct)} |

### 🎯 Summary
- **Total Tests:** ${testInfo.total} (${testInfo.passed} passed, ${testInfo.failed} failed)
- **Coverage Threshold:** ${parseFloat(total.statements.pct) >= 80 ? 'PASSED ✅' : 'FAILED ❌'}
- **Branch:** ${gitBranch}
- **Commit:** ${gitCommit}

## Coverage History
${newEntry}${historyContent ? historyContent : ''}

---
*Generated automatically by \`npm run test:coverage:report\`*
`;

    // Escrever arquivo
    fs.writeFileSync(readmePath, content);
    
    console.log('✅ Coverage report updated successfully!');
    console.log(`📊 Current Coverage: ${total.statements.pct}% statements, ${total.lines.pct}% lines`);
    console.log(`📝 Report saved to: TEST-COVERAGE.md`);
    
  } catch (error) {
    console.error('❌ Error updating coverage readme:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updateCoverageReadme();
}

module.exports = updateCoverageReadme;
