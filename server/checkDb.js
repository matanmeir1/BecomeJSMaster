const { connectToMongo, getDb, closeConnection } = require('./db');

async function checkDatabase() {
  try {
    await connectToMongo();
    const db = getDb();
    
    // Get all code blocks
    const codeBlocks = await db.collection('codeblocks').find({}).toArray();
    
    console.log('\nDatabase Contents:');
    console.log('------------------');
    console.log(`Total code blocks: ${codeBlocks.length}`);
    
    // Display each code block's title and hints
    codeBlocks.forEach((block, index) => {
      console.log(`\n${index + 1}. ${block.title}`);
      console.log('Hints:');
      block.hints.forEach((hint, i) => {
        console.log(`   ${i + 1}. ${hint}`);
      });
    });

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await closeConnection();
  }
}

checkDatabase(); 