/**
 * Script to generate coverage badge
 * Reads coverage summary and generates a badge URL
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const coverageSummaryPath = join(process.cwd(), 'coverage', 'coverage-final.json');

try {
    const coverage = JSON.parse(readFileSync(coverageSummaryPath, 'utf-8'));

    // Calculate total coverage from all files
    let totalStatements = 0;
    let coveredStatements = 0;

    for (const filePath in coverage) {
        const file = coverage[filePath];
        if (file.s) {
            // Count statements
            const statements = Object.keys(file.s);
            totalStatements += statements.length;
            coveredStatements += statements.filter(key => file.s[key] > 0).length;
        }
    }

    const total = totalStatements > 0
        ? Math.round((coveredStatements / totalStatements) * 100)
        : 0;

    // Determine badge color based on coverage
    let color = 'red';
    if (total >= 80) color = 'green';
    else if (total >= 60) color = 'yellow';
    else if (total >= 40) color = 'orange';

    const badgeUrl = `https://img.shields.io/badge/coverage-${total}%25-${color}`;

    console.log(`Coverage: ${total}%`);
    console.log(`Badge URL: ${badgeUrl}`);
    console.log(`\nMarkdown: [![Coverage](${badgeUrl})](./coverage)`);
} catch (error) {
    console.error('Error reading coverage summary:', error.message);
    process.exit(1);
}
