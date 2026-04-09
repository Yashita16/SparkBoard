

export const DEFAULT_PROMPTS = [
  
  { id: "m1",  type: "move",     enabled: true,  text: "Everyone stands up and does 10 jumping jacks together. Go!" },
  { id: "m2",  type: "move",     enabled: true,  text: "Form a human knot — hold hands across the circle and untangle without letting go." },
  { id: "m3",  type: "move",     enabled: true,  text: "Each team member strikes their best superhero pose and holds it for 5 seconds." },
  { id: "m4",  type: "move",     enabled: true,  text: "Do a team wave — one person starts, each person follows in sequence, repeat 3×." },
  { id: "m5",  type: "move",     enabled: true,  text: "Everyone stands and gives the person to their left a shoulder massage for 20 seconds. Switch!" },
  { id: "m6",  type: "move",     enabled: true,  text: "Play rock-paper-scissors tournament style — winner challenges the next person until one champion remains." },
  { id: "m7",  type: "move",     enabled: true,  text: "Team mirror: one person leads movements for 30 seconds, everyone else copies exactly." },
  { id: "m8",  type: "move",     enabled: true,  text: "Stand up and swap seats with someone who shares your birth month." },
  { id: "m9",  type: "move",     enabled: true,  text: "Everyone claps a rhythm simultaneously. If anyone is off-beat, start again. You have 60 seconds." },
  { id: "m10", type: "move",     enabled: true,  text: "Line up in order of height — no talking allowed, only gestures and signals." },

 
  { id: "t1",  type: "talk",     enabled: true,  text: "Each person shares one surprising fact about themselves that they think no one in the room knows." },
  { id: "t2",  type: "talk",     enabled: true,  text: "If your team were a movie, what genre would it be and who plays the lead? Everyone answers." },
  { id: "t3",  type: "talk",     enabled: true,  text: "What's one skill you have outside of work that would shock your colleagues? Share around the group." },
  { id: "t4",  type: "talk",     enabled: true,  text: "Two truths and a lie — the captain goes first, the team guesses which is the lie." },
  { id: "t5",  type: "talk",     enabled: true,  text: "What's the weirdest job you've ever had or heard of? Best story wins a round of applause." },
  { id: "t6",  type: "talk",     enabled: true,  text: "Name one thing you're genuinely proud of from the past year — personal or professional." },
  { id: "t7",  type: "talk",     enabled: true,  text: "If you had to describe this team in exactly three words, what would they be? Everyone shares." },
  { id: "t8",  type: "talk",     enabled: true,  text: "What's a common misconception people have about you or your role? Go around the group." },
  { id: "t9",  type: "talk",     enabled: true,  text: "Share the best piece of advice you've ever received. Who gave it and why did it stick?" },
  { id: "t10", type: "talk",     enabled: true,  text: "Hot take: share an unpopular opinion about your industry. Others can react but not debate." },

 
  { id: "c1",  type: "create",   enabled: true,  text: "In 60 seconds, design your team's logo using only hand gestures. Present it to the room." },
  { id: "c2",  type: "create",   enabled: true,  text: "Write a 3-line team motto that rhymes. You have 90 seconds. Perform it aloud." },
  { id: "c3",  type: "create",   enabled: true,  text: "Create a team handshake from scratch. You have 2 minutes. Perform it for the room." },
  { id: "c4",  type: "create",   enabled: true,  text: "Invent a new product that solves the most annoying thing about Mondays. Pitch it in 30 seconds." },
  { id: "c5",  type: "create",   enabled: true,  text: "Using only sounds (no words), recreate the vibe of your last team meeting. Everyone contributes." },
  { id: "c6",  type: "create",   enabled: true,  text: "Design your ideal team office in words — name 5 specific, ridiculous things it must have." },
  { id: "c7",  type: "create",   enabled: true,  text: "Write a one-sentence Wikipedia entry for your team. Make it sound legendary." },
  { id: "c8",  type: "create",   enabled: true,  text: "Create a 5-second commercial for your team using only clapping, humming, and one word." },
  { id: "c9",  type: "create",   enabled: true,  text: "Invent a team holiday. Name it, describe how it's celebrated, and what food is required." },
  { id: "c10", type: "create",   enabled: true,  text: "Compose a team theme song title and first line of lyrics. Bonus: sing it." },

  
  { id: "w1",  type: "wildcard", enabled: true,  text: "Your choice — pick any tile type (Move / Talk / Create) and draw a prompt from that category!" },
  { id: "w2",  type: "wildcard", enabled: true,  text: "Wildcard! Vote as a team: do something physical, share something personal, or create something ridiculous." },
  { id: "w3",  type: "wildcard", enabled: true,  text: "Free square — the team decides what happens next. You have full creative control for 2 minutes." },
];


export const getPromptsByType = (type, usedIds = []) => {
  return DEFAULT_PROMPTS.filter(
    p => p.type === type && p.enabled && !usedIds.includes(p.id)
  );
};


export const getRandomPrompt = (type, usedIds = []) => {
  const available = getPromptsByType(type, usedIds);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
};