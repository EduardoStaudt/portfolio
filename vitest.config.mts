import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['lib/**/*.test.ts'],
    environment: 'node',
    // No Windows, com o terminal aberto em "c:\..." (drive em minúscula), os pools padrão
    // carregam o Vitest duas vezes e os testes nem começam. O vmThreads não tem esse problema.
    pool: 'vmThreads',
  },
});
