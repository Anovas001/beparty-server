import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_STARTING_TOKENS = BigInt(process.env.DEFAULT_STARTING_TOKENS || '100');

async function main() {
  console.log('🌱 Starting MVP database seed...');

  // Create Users
  const djUser = await prisma.user.upsert({
    where: { email: 'dj@beparty.local' },
    update: {},
    create: {
      email: 'dj@beparty.local',
      password_hash: '$2b$10$dummy.hash.for.development.purposes.only', // In real app, use bcrypt
      display_name: 'DJ Master',
      role: 'DJ',
      tokens_balance: DEFAULT_STARTING_TOKENS,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@beparty.local' },
    update: {},
    create: {
      email: 'user1@beparty.local',
      password_hash: '$2b$10$dummy.hash.for.development.purposes.only',
      display_name: 'Party User 1',
      role: 'USER',
      tokens_balance: DEFAULT_STARTING_TOKENS,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@beparty.local' },
    update: {},
    create: {
      email: 'user2@beparty.local',
      password_hash: '$2b$10$dummy.hash.for.development.purposes.only',
      display_name: 'Party User 2',
      role: 'USER',
      tokens_balance: DEFAULT_STARTING_TOKENS,
    },
  });

  console.log('✅ Created users:', { djUser: djUser.display_name, user1: user1.display_name, user2: user2.display_name });

  // Create register bonus transactions for initial balances
  const registerTransactions = await Promise.all([
    prisma.tokenTransaction.create({
      data: {
        user_id: djUser.id,
        direction: 'EARN',
        amount: DEFAULT_STARTING_TOKENS,
        reason: 'REGISTER_BONUS',
      },
    }),
    prisma.tokenTransaction.create({
      data: {
        user_id: user1.id,
        direction: 'EARN',
        amount: DEFAULT_STARTING_TOKENS,
        reason: 'REGISTER_BONUS',
      },
    }),
    prisma.tokenTransaction.create({
      data: {
        user_id: user2.id,
        direction: 'EARN',
        amount: DEFAULT_STARTING_TOKENS,
        reason: 'REGISTER_BONUS',
      },
    }),
  ]);

  console.log('✅ Created register bonus transactions:', registerTransactions.length);

  // Create a LIVE session
  const session = await prisma.session.create({
    data: {
      name: 'Friday Night Party 🎉',
      dj_user_id: djUser.id,
      status: 'LIVE',
    },
  });

  console.log('✅ Created session:', session.name);

  // Create SessionSongs with realistic Spotify data
  const sessionSongs = await Promise.all([
    prisma.sessionSong.create({
      data: {
        session_id: session.id,
        spotify_track_id: '4iV5W9uYEdYUVa79Axb7Rh', // Real Spotify ID: "Flowers" by Miley Cyrus
        track_name: 'Flowers',
        artist_name: 'Miley Cyrus',
        album_name: 'Endless Summer Vacation',
        cover_url: 'https://i.scdn.co/image/ab67616d0000b273f46b9d202509a8f7384b90de',
        duration_ms: 200455,
        total_tokens: BigInt(0),
      },
    }),
    prisma.sessionSong.create({
      data: {
        session_id: session.id,
        spotify_track_id: '1BxfuPKGuaTgP7aM0Bbdwr', // Real Spotify ID: "Cruel Summer" by Taylor Swift
        track_name: 'Cruel Summer',
        artist_name: 'Taylor Swift',
        album_name: 'Lover',
        cover_url: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647',
        duration_ms: 178426,
        total_tokens: BigInt(0),
      },
    }),
    prisma.sessionSong.create({
      data: {
        session_id: session.id,
        spotify_track_id: '7qiZfU4dY1lWllzX7mPBI3', // Real Spotify ID: "Shape of You" by Ed Sheeran
        track_name: 'Shape of You',
        artist_name: 'Ed Sheeran',
        album_name: '÷ (Deluxe)',
        cover_url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
        duration_ms: 233713,
        total_tokens: BigInt(0),
      },
    }),
  ]);

  console.log('✅ Created session songs:', sessionSongs.map(s => s.track_name));

  // Create some votes with token transactions
  const votes = [];
  let voteTransactions = [];

  // User 1 votes for "Flowers" with 25 tokens
  const vote1 = await prisma.vote.create({
    data: {
      session_song_id: sessionSongs[0].id,
      user_id: user1.id,
      tokens_spent: BigInt(25),
    },
  });
  votes.push(vote1);

  // Update user balance and session song total
  await prisma.user.update({
    where: { id: user1.id },
    data: { tokens_balance: { decrement: BigInt(25) } },
  });

  await prisma.sessionSong.update({
    where: { id: sessionSongs[0].id },
    data: { total_tokens: { increment: BigInt(25) } },
  });

  // Create corresponding transaction
  const voteTx1 = await prisma.tokenTransaction.create({
    data: {
      user_id: user1.id,
      direction: 'SPEND',
      amount: BigInt(25),
      reason: 'VOTE',
      session_id: session.id,
    },
  });
  voteTransactions.push(voteTx1);

  // User 2 votes for "Cruel Summer" with 35 tokens
  const vote2 = await prisma.vote.create({
    data: {
      session_song_id: sessionSongs[1].id,
      user_id: user2.id,
      tokens_spent: BigInt(35),
    },
  });
  votes.push(vote2);

  await prisma.user.update({
    where: { id: user2.id },
    data: { tokens_balance: { decrement: BigInt(35) } },
  });

  await prisma.sessionSong.update({
    where: { id: sessionSongs[1].id },
    data: { total_tokens: { increment: BigInt(35) } },
  });

  const voteTx2 = await prisma.tokenTransaction.create({
    data: {
      user_id: user2.id,
      direction: 'SPEND',
      amount: BigInt(35),
      reason: 'VOTE',
      session_id: session.id,
    },
  });
  voteTransactions.push(voteTx2);

  // User 1 votes for "Shape of You" with 15 tokens
  const vote3 = await prisma.vote.create({
    data: {
      session_song_id: sessionSongs[2].id,
      user_id: user1.id,
      tokens_spent: BigInt(15),
    },
  });
  votes.push(vote3);

  await prisma.user.update({
    where: { id: user1.id },
    data: { tokens_balance: { decrement: BigInt(15) } },
  });

  await prisma.sessionSong.update({
    where: { id: sessionSongs[2].id },
    data: { total_tokens: { increment: BigInt(15) } },
  });

  const voteTx3 = await prisma.tokenTransaction.create({
    data: {
      user_id: user1.id,
      direction: 'SPEND',
      amount: BigInt(15),
      reason: 'VOTE',
      session_id: session.id,
    },
  });
  voteTransactions.push(voteTx3);

  console.log('✅ Created votes and transactions:', votes.length);

  // Verify final state
  const finalUsers = await prisma.user.findMany({
    select: {
      display_name: true,
      tokens_balance: true,
      role: true,
    },
  });

  const finalSessionSongs = await prisma.sessionSong.findMany({
    where: { session_id: session.id },
    select: {
      track_name: true,
      artist_name: true,
      total_tokens: true,
    },
    orderBy: { total_tokens: 'desc' },
  });

  console.log('📊 Final user balances:');
  finalUsers.forEach(user => {
    console.log(`  ${user.display_name} (${user.role}): ${user.tokens_balance} tokens`);
  });

  console.log('🏆 Session scoreboard:');
  finalSessionSongs.forEach((song, index) => {
    console.log(`  ${index + 1}. ${song.track_name} by ${song.artist_name}: ${song.total_tokens} tokens`);
  });

  console.log(`🎉 MVP database seeded successfully! Session ID: ${session.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });