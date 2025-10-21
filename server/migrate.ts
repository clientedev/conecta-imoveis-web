import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigrations() {
  console.log('🔄 Verificando e criando tabelas do banco de dados...');
  
  try {
    // Executar drizzle-kit push
    const { stdout, stderr } = await execAsync('npx drizzle-kit push');
    
    if (stdout) {
      console.log('📊 Saída do drizzle-kit:');
      console.log(stdout);
    }
    
    if (stderr && !stderr.includes('Everything is up to date')) {
      console.log('⚠️  Avisos:');
      console.log(stderr);
    }
    
    console.log('✅ Tabelas do banco de dados verificadas/criadas com sucesso!');
  } catch (error: any) {
    console.error('❌ Erro ao criar tabelas:', error.message);
    
    // Não fazer exit, permitir que o servidor inicie mesmo se as tabelas já existirem
    if (error.message.includes('already exists') || error.message.includes('up to date')) {
      console.log('✅ Tabelas já existem, continuando...');
    } else {
      console.error('Detalhes do erro:', error);
      // Só falhar se for um erro crítico
      process.exit(1);
    }
  }
}

// Executar migrations
runMigrations();
