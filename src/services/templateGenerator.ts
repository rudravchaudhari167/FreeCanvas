import {
  Canvas as FabricCanvas,
  Rect,
  Textbox,
  Line
} from 'fabric';

/**
 * Creates a Weekly Planner template across Monday - Sunday with task lists
 */
export function createWeeklyPlanner(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 60;
  const colWidth = 150;
  const colGap = 16;
  const cardHeight = 540;

  // Header Title
  const title = new Textbox('Weekly Planner & Focus', {
    left: startX,
    top: startY,
    width: 600,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });
  canvas.add(title);

  const days = [
    { name: 'Monday', color: '#FAF0D7', badge: '#EAD7B2' },
    { name: 'Tuesday', color: '#FAF0D7', badge: '#EAD7B2' },
    { name: 'Wednesday', color: '#FAF0D7', badge: '#EAD7B2' },
    { name: 'Thursday', color: '#FAF0D7', badge: '#EAD7B2' },
    { name: 'Friday', color: '#FAF0D7', badge: '#EAD7B2' },
    { name: 'Saturday', color: '#EAEEDD', badge: '#C9D4B5' },
    { name: 'Sunday', color: '#EAEEDD', badge: '#C9D4B5' }
  ];

  days.forEach((day, i) => {
    const colX = startX + i * (colWidth + colGap);
    const colY = startY + 50;

    // Background Column Card
    const colCard = new Rect({
      left: colX,
      top: colY,
      width: colWidth,
      height: cardHeight,
      fill: '#FFFEFA',
      stroke: '#E8DED2',
      strokeWidth: 1.5,
      rx: 12,
      ry: 12,
      shadow: {
        color: 'rgba(0,0,0,0.04)',
        blur: 6,
        offsetX: 0,
        offsetY: 2
      } as any
    });

    // Column Header Tag
    const headerRect = new Rect({
      left: colX,
      top: colY,
      width: colWidth,
      height: 42,
      fill: day.color,
      stroke: '#E8DED2',
      strokeWidth: 1.5,
      rx: 12,
      ry: 12
    });

    // Day Name
    const dayText = new Textbox(day.name, {
      left: colX + 12,
      top: colY + 12,
      width: colWidth - 24,
      fontSize: 14,
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: 'bold',
      fill: '#30312D',
      textAlign: 'center'
    });

    // Task Items Textbox
    const taskText = new Textbox('☐ Top Priority\n\n☐ Task 2\n\n☐ Task 3\n\n☐ Notes...', {
      left: colX + 14,
      top: colY + 58,
      width: colWidth - 28,
      fontSize: 12.5,
      fontFamily: 'Plus Jakarta Sans',
      fill: '#4A4843',
      lineHeight: 1.4
    });

    canvas.add(colCard, headerRect, dayText, taskText);
  });

  canvas.renderAll();
}

/**
 * Creates Cornell Notes template (Cue Column, Main Notes Column, Summary Footer)
 */
export function createCornellNotes(canvas: FabricCanvas): void {
  const startX = 70;
  const startY = 60;
  const totalWidth = 1060;
  const notesHeight = 440;
  const cueWidth = 300;
  const mainWidth = totalWidth - cueWidth - 18;
  const summaryHeight = 150;

  // Header Title
  const title = new Textbox('Topic / Lecture Title', {
    left: startX,
    top: startY,
    width: 600,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });

  const metaText = new Textbox('Date: ______________   |   Source: ______________', {
    left: startX,
    top: startY + 38,
    width: 600,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#79766F'
  });

  canvas.add(title, metaText);

  // Cue / Recall Questions Card
  const cueCard = new Rect({
    left: startX,
    top: startY + 75,
    width: cueWidth,
    height: notesHeight,
    fill: '#FAF5EE',
    stroke: '#E5DCD0',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10
  });

  const cueHeader = new Textbox('Recall / Key Questions', {
    left: startX + 16,
    top: startY + 90,
    width: cueWidth - 32,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#5E6547'
  });

  const cueContent = new Textbox('• Main keyword\n\n• What is the core question?\n\n• Key definition\n\n• Important date or formula', {
    left: startX + 16,
    top: startY + 125,
    width: cueWidth - 32,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#4A4843'
  });

  // Main Notes Card
  const mainCard = new Rect({
    left: startX + cueWidth + 18,
    top: startY + 75,
    width: mainWidth,
    height: notesHeight,
    fill: '#FFFEFA',
    stroke: '#E5DCD0',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10
  });

  const mainHeader = new Textbox('Notes & Detailed Concepts', {
    left: startX + cueWidth + 36,
    top: startY + 90,
    width: mainWidth - 36,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });

  const mainContent = new Textbox('1. Detailed explanations and bullet points go here.\n\n2. Add sketches, diagrams, and formulas in this space.\n\n3. Use abbreviations to capture thoughts quickly.\n\n4. Highlight key relationships and consequences.', {
    left: startX + cueWidth + 36,
    top: startY + 125,
    width: mainWidth - 52,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#4A4843'
  });

  // Summary Footer
  const summaryCard = new Rect({
    left: startX,
    top: startY + 75 + notesHeight + 16,
    width: totalWidth,
    height: summaryHeight,
    fill: '#F5EFE5',
    stroke: '#E5DCD0',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10
  });

  const summaryHeader = new Textbox('Summary & Key Takeaways', {
    left: startX + 18,
    top: startY + 75 + notesHeight + 30,
    width: totalWidth - 36,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#777D5E'
  });

  const summaryContent = new Textbox('Synthesize the entire topic into 2-3 brief sentences here. What is the fundamental concept you need to remember?', {
    left: startX + 18,
    top: startY + 75 + notesHeight + 60,
    width: totalWidth - 36,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#4A4843'
  });

  canvas.add(
    cueCard, cueHeader, cueContent,
    mainCard, mainHeader, mainContent,
    summaryCard, summaryHeader, summaryContent
  );
  canvas.renderAll();
}

/**
 * Creates Mind Map template with central concept and 4 branch clusters
 */
export function createMindMap(canvas: FabricCanvas): void {
  const centerX = 560;
  const centerY = 340;

  // Central Bubble
  const centerRect = new Rect({
    left: centerX - 110,
    top: centerY - 45,
    width: 220,
    height: 90,
    fill: '#FAF0D7',
    stroke: '#777D5E',
    strokeWidth: 2.5,
    rx: 24,
    ry: 24,
    shadow: {
      color: 'rgba(70, 60, 45, 0.1)',
      blur: 10,
      offsetX: 0,
      offsetY: 3
    } as any
  });

  const centerText = new Textbox('Central Idea / Goal', {
    left: centerX - 95,
    top: centerY - 14,
    width: 190,
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D',
    textAlign: 'center'
  });

  canvas.add(centerRect, centerText);

  // 4 Branch Nodes
  const branches = [
    { label: 'Theme 1: Research', x: centerX - 360, y: centerY - 170, color: '#EAEEDD', borderColor: '#777D5E' },
    { label: 'Theme 2: Design', x: centerX + 180, y: centerY - 170, color: '#FCEEE7', borderColor: '#D99379' },
    { label: 'Theme 3: Strategy', x: centerX - 360, y: centerY + 120, color: '#FCEEE7', borderColor: '#D99379' },
    { label: 'Theme 4: Execution', x: centerX + 180, y: centerY + 120, color: '#EAEEDD', borderColor: '#777D5E' }
  ];

  branches.forEach((b) => {
    // Connector Line
    const line = new Line([centerX, centerY, b.x + 90, b.y + 40], {
      stroke: '#C2B8A8',
      strokeWidth: 2,
      strokeDashArray: [4, 4]
    });

    const bCard = new Rect({
      left: b.x,
      top: b.y,
      width: 180,
      height: 80,
      fill: b.color,
      stroke: b.borderColor,
      strokeWidth: 1.5,
      rx: 16,
      ry: 16
    });

    const bText = new Textbox(`${b.label}\n• Key sub-point`, {
      left: b.x + 14,
      top: b.y + 16,
      width: 152,
      fontSize: 13,
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: '600',
      fill: '#30312D'
    });

    canvas.add(line, bCard, bText);
  });

  canvas.renderAll();
}

/**
 * Creates Storyboard / Moodboard template with 6 grid visual frames
 */
export function createStoryboard(canvas: FabricCanvas): void {
  const startX = 70;
  const startY = 60;
  const frameWidth = 320;
  const frameHeight = 250;
  const gapX = 35;
  const gapY = 35;

  const title = new Textbox('Storyboard & Visual Frames', {
    left: startX,
    top: startY,
    width: 600,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });
  canvas.add(title);

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const idx = row * 3 + col + 1;
      const x = startX + col * (frameWidth + gapX);
      const y = startY + 50 + row * (frameHeight + gapY);

      // Outer Frame
      const frameRect = new Rect({
        left: x,
        top: y,
        width: frameWidth,
        height: frameHeight,
        fill: '#FFFEFA',
        stroke: '#E2D8CA',
        strokeWidth: 1.5,
        rx: 10,
        ry: 10
      });

      // Drawing sketch box inside
      const sketchBox = new Rect({
        left: x + 12,
        top: y + 12,
        width: frameWidth - 24,
        height: frameHeight - 80,
        fill: '#FAF6EE',
        stroke: '#EBE2D5',
        strokeWidth: 1,
        rx: 6,
        ry: 6
      });

      // Scene caption label
      const caption = new Textbox(`Frame ${idx}: Description & Action\nNotes on characters, camera angle, or design`, {
        left: x + 14,
        top: y + frameHeight - 60,
        width: frameWidth - 28,
        fontSize: 12,
        fontFamily: 'Plus Jakarta Sans',
        fill: '#4A4843'
      });

      canvas.add(frameRect, sketchBox, caption);
    }
  }

  canvas.renderAll();
}

/**
 * Creates Kanban Board template (To Do, In Progress, Done)
 */
export function createKanbanBoard(canvas: FabricCanvas): void {
  const startX = 80;
  const startY = 60;
  const colWidth = 330;
  const colGap = 28;
  const colHeight = 580;

  const title = new Textbox('Project Kanban Board', {
    left: startX,
    top: startY,
    width: 600,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });
  canvas.add(title);

  const columns = [
    { title: 'To Do', color: '#FAF0D7', badge: '#EAD7B2', sample: 'Draft design requirements\nReview botanical assets' },
    { title: 'In Progress', color: '#EAEEDD', badge: '#C9D4B5', sample: 'Refine typography system\nBuild template modal' },
    { title: 'Done', color: '#FCEEE7', badge: '#ECC6B7', sample: 'Sticky note text styling\nRemove legacy layers panel' }
  ];

  columns.forEach((col, idx) => {
    const x = startX + idx * (colWidth + colGap);
    const y = startY + 50;

    // Column container
    const card = new Rect({
      left: x,
      top: y,
      width: colWidth,
      height: colHeight,
      fill: '#FAF6EE',
      stroke: '#E2D8CA',
      strokeWidth: 1.5,
      rx: 14,
      ry: 14
    });

    // Header badge
    const badge = new Rect({
      left: x + 16,
      top: y + 16,
      width: colWidth - 32,
      height: 38,
      fill: col.color,
      stroke: '#DCD1C2',
      strokeWidth: 1.5,
      rx: 8,
      ry: 8
    });

    const headerText = new Textbox(col.title, {
      left: x + 24,
      top: y + 25,
      width: colWidth - 48,
      fontSize: 14,
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: 'bold',
      fill: '#30312D',
      textAlign: 'center'
    });

    // Sample Task Card
    const taskCard = new Rect({
      left: x + 18,
      top: y + 74,
      width: colWidth - 36,
      height: 90,
      fill: '#FFFEFA',
      stroke: '#E8DED2',
      strokeWidth: 1.5,
      rx: 8,
      ry: 8,
      shadow: {
        color: 'rgba(0,0,0,0.03)',
        blur: 5,
        offsetX: 0,
        offsetY: 2
      } as any
    });

    const taskText = new Textbox(col.sample, {
      left: x + 30,
      top: y + 88,
      width: colWidth - 60,
      fontSize: 13,
      fontFamily: 'Plus Jakarta Sans',
      fill: '#4A4843'
    });

    canvas.add(card, badge, headerText, taskCard, taskText);
  });

  canvas.renderAll();
}
