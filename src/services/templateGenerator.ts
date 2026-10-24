import {
  Canvas as FabricCanvas,
  Rect,
  Textbox,
  Line,
  Polygon,
  Circle
} from 'fabric';

/**
 * Standard UI Layout Helpers ensuring exact 'left', 'top' positioning in Fabric 7
 */
function createTitle(text: string, left: number, top: number, width = 700): Textbox {
  return new Textbox(text, {
    left,
    top,
    width,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D',
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });
}

function createSubtitle(text: string, left: number, top: number, width = 850): Textbox {
  return new Textbox(text, {
    left,
    top,
    width,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#79766F',
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });
}

function createPanel(
  left: number,
  top: number,
  width: number,
  height: number,
  fill: string,
  stroke = '#E2D8CA',
  rx = 12
): Rect {
  return new Rect({
    left,
    top,
    width,
    height,
    fill,
    stroke,
    strokeWidth: 1.5,
    rx,
    ry: rx,
    originX: 'left',
    originY: 'top',
    selectable: false,
    evented: false
  });
}

function createSectionHeader(
  text: string,
  left: number,
  top: number,
  width: number,
  color = '#30312D',
  fontSize = 14
): Textbox {
  return new Textbox(text, {
    left,
    top,
    width,
    fontSize,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: color,
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });
}

function createBodyText(
  text: string,
  left: number,
  top: number,
  width: number,
  color = '#4A4843',
  fontSize = 13,
  lineHeight = 1.35
): Textbox {
  return new Textbox(text, {
    left,
    top,
    width,
    fontSize,
    fontFamily: 'Plus Jakarta Sans',
    fill: color,
    lineHeight,
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });
}

function createNodeShape(
  width: number,
  height: number,
  left: number,
  top: number,
  fill: string,
  stroke: string,
  rx = 8
): Rect {
  return new Rect({
    left,
    top,
    width,
    height,
    fill,
    stroke,
    strokeWidth: 2,
    rx,
    ry: rx,
    originX: 'left',
    originY: 'top',
    selectable: false,
    evented: false
  });
}

function createDiamondShape(
  left: number,
  top: number,
  width: number,
  height: number,
  fill: string,
  stroke: string
): Polygon {
  const w = width;
  const h = height;
  return new Polygon([
    { x: w / 2, y: 0 },
    { x: w, y: h / 2 },
    { x: w / 2, y: h },
    { x: 0, y: h / 2 }
  ], {
    left,
    top,
    fill,
    stroke,
    strokeWidth: 2,
    originX: 'left',
    originY: 'top',
    selectable: false,
    evented: false
  });
}

function createParallelogramShape(
  left: number,
  top: number,
  width: number,
  height: number,
  fill: string,
  stroke: string,
  skew = 18
): Polygon {
  const w = width;
  const h = height;
  return new Polygon([
    { x: skew, y: 0 },
    { x: w, y: 0 },
    { x: w - skew, y: h },
    { x: 0, y: h }
  ], {
    left,
    top,
    fill,
    stroke,
    strokeWidth: 2,
    originX: 'left',
    originY: 'top',
    selectable: false,
    evented: false
  });
}

function createEditableNodeText(
  textStr: string,
  left: number,
  top: number,
  width: number,
  fontSize = 13,
  color = '#30312D',
  align: 'center' | 'left' = 'center'
): Textbox {
  return new Textbox(textStr, {
    left,
    top,
    width,
    fontSize,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
    fill: color,
    textAlign: align,
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });
}

/**
 * 1. Weekly Schedule & Study Planner template
 */
export function createWeeklyPlanner(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;
  const colWidth = 145;
  const colGap = 14;
  const cardHeight = 560;

  const title = createTitle('Weekly Schedule & Study Planner', startX, startY, 650);
  const subtitle = createSubtitle('Plan weekly focus, lectures, assignments, readings, and study habits across Monday – Sunday', startX, startY + 34, 800);
  canvas.add(title, subtitle);

  const days = [
    { name: 'Monday', color: '#FAF0D7' },
    { name: 'Tuesday', color: '#FAF0D7' },
    { name: 'Wednesday', color: '#FAF0D7' },
    { name: 'Thursday', color: '#FAF0D7' },
    { name: 'Friday', color: '#FAF0D7' },
    { name: 'Saturday', color: '#EAEEDD' },
    { name: 'Sunday', color: '#EAEEDD' }
  ];

  days.forEach((day, i) => {
    const colX = startX + i * (colWidth + colGap);
    const colY = startY + 70;

    // Background Column Card (non-blocking)
    const colCard = createPanel(colX, colY, colWidth, cardHeight, '#FFFEFA', '#E8DED2', 12);

    // Column Header Tag (non-blocking)
    const headerRect = createPanel(colX, colY, colWidth, 42, day.color, '#E8DED2', 12);

    // Day Name Text
    const dayText = new Textbox(day.name, {
      left: colX,
      top: colY + 12,
      width: colWidth,
      fontSize: 14,
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: 'bold',
      fill: '#30312D',
      textAlign: 'center',
      originX: 'left',
      originY: 'top',
      selectable: true,
      evented: true
    });

    // Task Items Textbox (editable)
    const taskText = createBodyText(
      '☐ Lecture 1\n\n☐ Assignment\n\n☐ Lab Review\n\n☐ Reading Chapter\n\n☐ Problem Set',
      colX + 12,
      colY + 56,
      colWidth - 24,
      '#4A4843',
      12.5,
      1.4
    );

    canvas.add(colCard, headerRect, dayText, taskText);
  });

  canvas.renderAll();
}

/**
 * 2. Cornell Lecture Notes template (Recall Cues, Main Notes, Summary)
 */
export function createCornellNotes(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;
  const totalWidth = 1080;
  const notesHeight = 440;
  const cueWidth = 310;
  const mainWidth = totalWidth - cueWidth - 18;
  const summaryHeight = 150;

  const title = createTitle('Lecture & Research Cornell Notes', startX, startY, 650);
  const metaText = createSubtitle('Course: ______________  |  Topic: ______________  |  Date: ______________  |  Professor: ______________', startX, startY + 34, 850);
  canvas.add(title, metaText);

  const topContentY = startY + 70;

  // Cue Card Background
  const cueCard = createPanel(startX, topContentY, cueWidth, notesHeight, '#FAF5EE', '#E5DCD0', 10);
  const cueHeader = createSectionHeader('Cues, Questions & Formulas', startX + 16, topContentY + 16, cueWidth - 32, '#5E6547', 14);
  const cueContent = createBodyText(
    '• What is the main thesis?\n\n• Key formulas or dates\n\n• Potential exam questions\n\n• Essential definitions\n\n• Link to prior chapter',
    startX + 16,
    topContentY + 50,
    cueWidth - 32,
    '#4A4843',
    13,
    1.4
  );

  // Main Notes Card Background
  const mainCard = createPanel(startX + cueWidth + 18, topContentY, mainWidth, notesHeight, '#FFFEFA', '#E5DCD0', 10);
  const mainHeader = createSectionHeader('Main Lecture Notes & Proofs', startX + cueWidth + 36, topContentY + 16, mainWidth - 36, '#30312D', 14);
  const mainContent = createBodyText(
    '1. Detailed lecture notes, theorem derivations, and algorithmic proofs go here.\n\n2. Draw diagrams or molecular/flowchart sketches beside steps.\n\n3. Use concise outlines, indentation, and numbered hierarchies.\n\n4. Write down references, citations, and instructor slide numbers.\n\n5. Star (*) key concepts emphasized during class.',
    startX + cueWidth + 36,
    topContentY + 50,
    mainWidth - 52,
    '#4A4843',
    13,
    1.4
  );

  // Summary Card Background
  const summaryY = topContentY + notesHeight + 16;
  const summaryCard = createPanel(startX, summaryY, totalWidth, summaryHeight, '#F5EFE5', '#E5DCD0', 10);
  const summaryHeader = createSectionHeader('Summary & Core Takeaways (Post-Lecture Review)', startX + 18, summaryY + 14, totalWidth - 36, '#777D5E', 14);
  const summaryContent = createBodyText(
    'Condense the entire lecture into 2-3 core takeaway sentences. What are the fundamental principles and how do they apply to problem solving on exams or project implementations?',
    startX + 18,
    summaryY + 44,
    totalWidth - 36,
    '#4A4843',
    13,
    1.45
  );

  canvas.add(
    cueCard, cueHeader, cueContent,
    mainCard, mainHeader, mainContent,
    summaryCard, summaryHeader, summaryContent
  );
  canvas.renderAll();
}

/**
 * 3. Algorithm & Logic Flowchart template (Clean direct textboxes, zero group bugs)
 */
export function createFlowchart(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;

  const title = createTitle('Algorithm & Logic Flowchart', startX, startY, 650);
  const subtitle = createSubtitle('Visual procedure diagram: Start, Input, Process, Decision condition, and End terminal', startX, startY + 34, 850);
  canvas.add(title, subtitle);

  const centerX = 530;

  // Connecting Lines (added behind shapes)
  const lines = [
    // Start (bottom 160) -> Input (top 190)
    new Line([centerX, 160, centerX, 190], { stroke: '#777D5E', strokeWidth: 2, selectable: false }),
    // Input (bottom 244) -> Process (top 274)
    new Line([centerX, 244, centerX, 274], { stroke: '#777D5E', strokeWidth: 2, selectable: false }),
    // Process (bottom 330) -> Decision (top 360)
    new Line([centerX, 330, centerX, 360], { stroke: '#777D5E', strokeWidth: 2, selectable: false }),
    // Decision (bottom 450) -> Output (top 490) (YES)
    new Line([centerX, 450, centerX, 490], { stroke: '#5E6547', strokeWidth: 2, selectable: false }),
    // Decision (right 630, 405) -> Fallback (left 710, 405) (NO)
    new Line([630, 405, 710, 405], { stroke: '#D99379', strokeWidth: 2, selectable: false }),
    // Fallback Loop back to Process: (890, 405) -> (920, 405) -> (920, 302) -> (620, 302)
    new Line([890, 405, 920, 405], { stroke: '#D99379', strokeWidth: 2, selectable: false }),
    new Line([920, 405, 920, 302], { stroke: '#D99379', strokeWidth: 2, selectable: false }),
    new Line([920, 302, 620, 302], { stroke: '#D99379', strokeWidth: 2, selectable: false }),
    // Output (bottom 544) -> End (top 574)
    new Line([centerX, 544, centerX, 574], { stroke: '#777D5E', strokeWidth: 2, selectable: false })
  ];
  lines.forEach((l) => canvas.add(l));

  // Node 1: Start Pill at (440, 110) [180x50]
  const bgStart = createNodeShape(180, 50, 440, 110, '#FAF0D7', '#777D5E', 25);
  const textStart = createEditableNodeText('START', 440, 126, 180, 13, '#30312D');

  // Node 2: Input Parallelogram at (440, 190) [180x54]
  const bgInput = createParallelogramShape(440, 190, 180, 54, '#EAEEDD', '#5E6547', 18);
  const textInput = createEditableNodeText('Read Input Data', 440, 208, 180, 12.5, '#30312D');

  // Node 3: Process Box at (440, 274) [180x56]
  const bgProcess = createNodeShape(180, 56, 440, 274, '#FFFEFA', '#777D5E', 8);
  const textProcess = createEditableNodeText('Execute Computation\n& Validate State', 440, 283, 180, 12.5, '#30312D');

  // Node 4: Decision Diamond at (430, 360) [200x90]
  const bgDecision = createDiamondShape(430, 360, 200, 90, '#FCEEE7', '#D99379');
  const textDecision = createEditableNodeText('Is Valid / Solved?', 430, 396, 200, 12.5, '#30312D');

  // Node 5: Output Box at (440, 490) [180x54]
  const bgOutput = createNodeShape(180, 54, 440, 490, '#EAEEDD', '#5E6547', 8);
  const textOutput = createEditableNodeText('Output Final Result', 440, 508, 180, 12.5, '#30312D');

  // Node 6: Fallback Loop Step at (710, 377) [180x56]
  const bgFallback = createNodeShape(180, 56, 710, 377, '#FAF5EE', '#D99379', 8);
  const textFallback = createEditableNodeText('Adjust Parameters\n& Retry Step', 710, 386, 180, 12.5, '#30312D');

  // Node 7: End Pill at (440, 574) [180x50]
  const bgEnd = createNodeShape(180, 50, 440, 574, '#FAF0D7', '#777D5E', 25);
  const textEnd = createEditableNodeText('END / RETURN', 440, 590, 180, 13, '#30312D');

  const yesLabel = new Textbox('YES', {
    left: centerX + 10,
    top: 460,
    fontSize: 11,
    fontWeight: 'bold',
    fill: '#5E6547',
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });

  const noLabel = new Textbox('NO', {
    left: 650,
    top: 386,
    fontSize: 11,
    fontWeight: 'bold',
    fill: '#D99379',
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });

  canvas.add(
    bgStart, textStart,
    bgInput, textInput,
    bgProcess, textProcess,
    bgDecision, textDecision,
    bgOutput, textOutput,
    bgFallback, textFallback,
    bgEnd, textEnd,
    yesLabel, noLabel
  );

  canvas.renderAll();
}

/**
 * 4. Lab Report & Scientific Protocol template
 */
export function createLabReport(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;
  const colWidth = 530;
  const gapX = 24;
  const totalWidth = colWidth * 2 + gapX;

  const title = createTitle('Scientific Lab Report & Experiment Protocol', startX, startY, 700);
  const metaText = createSubtitle('Course: ______________  |  Experiment #: ______  |  Lab Partner: ______________  |  Date: ______________', startX, startY + 34, 850);
  canvas.add(title, metaText);

  const topY = startY + 70;

  // Section 1: Objective & Hypothesis
  const sec1Card = createPanel(startX, topY, colWidth, 180, '#FAF5EE', '#E2D8CA', 10);
  const sec1Header = createSectionHeader('1. Objective & Hypothesis', startX + 16, topY + 16, colWidth - 32, '#5E6547');
  const sec1Body = createBodyText(
    '• Objective: Determine the reaction rate constant and kinetics order.\n\n• Hypothesis: If the temperature increases by 10°C, the reaction rate will double as predicted by the Arrhenius equation model.',
    startX + 16,
    topY + 46,
    colWidth - 32,
    '#4A4843',
    12.5,
    1.35
  );

  // Section 2: Materials & Apparatus
  const sec2Card = createPanel(startX + colWidth + gapX, topY, colWidth, 180, '#FFFEFA', '#E2D8CA', 10);
  const sec2Header = createSectionHeader('2. Apparatus & Chemical Reagents', startX + colWidth + gapX + 16, topY + 16, colWidth - 32, '#30312D');
  const sec2Body = createBodyText(
    '• 50mL Precision Burette & Magnetic Stirrer\n• 0.1M Sodium Hydroxide (NaOH) & 0.1M HCl\n• Spectrophotometer (λ = 520nm) & Cuvettes\n• Digital Thermocouple Probe & Stopwatch',
    startX + colWidth + gapX + 16,
    topY + 46,
    colWidth - 32,
    '#4A4843',
    12.5,
    1.35
  );

  // Section 3: Experimental Procedure
  const midY = topY + 196;
  const sec3Card = createPanel(startX, midY, colWidth, 196, '#FFFEFA', '#E2D8CA', 10);
  const sec3Header = createSectionHeader('3. Methodology & Procedure Steps', startX + 16, midY + 16, colWidth - 32, '#30312D');
  const sec3Body = createBodyText(
    'Step 1: Calibrate pH probe with standard buffer solution (pH 7.0).\nStep 2: Add 25mL reactant into constant water bath at 25°C.\nStep 3: Initiate reaction and record optical density every 30 seconds.\nStep 4: Repeat 3 trials across 35°C, 45°C, and 55°C.',
    startX + 16,
    midY + 46,
    colWidth - 32,
    '#4A4843',
    12.5,
    1.35
  );

  // Section 4: Data & Observation Table
  const sec4Card = createPanel(startX + colWidth + gapX, midY, colWidth, 196, '#FAF5EE', '#E2D8CA', 10);
  const sec4Header = createSectionHeader('4. Data & Observation Table', startX + colWidth + gapX + 16, midY + 16, colWidth - 32, '#5E6547');
  const sec4Body = createBodyText(
    'Trial | Temp (°C) | Initial Rate (M/s) | Final Abs\n----------------------------------------------------\n  1   |   25.0    |    1.42 × 10⁻³    |   0.824\n  2   |   35.2    |    2.86 × 10⁻³    |   0.819\n  3   |   45.1    |    5.71 × 10⁻³    |   0.828',
    startX + colWidth + gapX + 16,
    midY + 46,
    colWidth - 32,
    '#4A4843',
    12,
    1.35
  );

  // Section 5: Conclusion & Discussion
  const bottomY = midY + 212;
  const sec5Card = createPanel(startX, bottomY, totalWidth, 150, '#FAF0D7', '#E2D8CA', 10);
  const sec5Header = createSectionHeader('5. Discussion, Error Analysis & Conclusion', startX + 16, bottomY + 16, totalWidth - 32, '#5E6547');
  const sec5Body = createBodyText(
    '• Result: Activation energy (Ea) was calculated to be 52.4 kJ/mol, matching theoretical values within 3.2% error margin.\n• Sources of Error: Heat loss to surroundings during liquid transfer; minor meniscus reading parallax in trial 2.\n• Conclusion: The experimental rate law confirmed first-order dependence on reactant concentration.',
    startX + 16,
    bottomY + 46,
    totalWidth - 32,
    '#4A4843',
    12.5,
    1.35
  );

  canvas.add(
    sec1Card, sec1Header, sec1Body,
    sec2Card, sec2Header, sec2Body,
    sec3Card, sec3Header, sec3Body,
    sec4Card, sec4Header, sec4Body,
    sec5Card, sec5Header, sec5Body
  );
  canvas.renderAll();
}

/**
 * 5. SWOT Analysis Matrix template
 */
export function createSwotMatrix(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;
  const quadWidth = 530;
  const quadHeight = 260;
  const gap = 24;

  const title = createTitle('SWOT Strategic Analysis Matrix', startX, startY, 650);
  const subtitle = createSubtitle('Comprehensive 4-quadrant strategic matrix for business cases, project evaluations, and academic research', startX, startY + 34, 850);
  canvas.add(title, subtitle);

  const topContentY = startY + 70;

  const quadrants = [
    {
      title: 'STRENGTHS (Internal)',
      sub: 'Helpful internal attributes of the project / organization',
      items: '• Proprietary technology & algorithmic IP assets\n• High customer retention & recognized brand reputation\n• Experienced cross-functional research team\n• Lean operational and infrastructure cost structure',
      color: '#EAEEDD',
      borderColor: '#777D5E',
      headerColor: '#5E6547',
      x: startX,
      y: topContentY
    },
    {
      title: 'WEAKNESSES (Internal)',
      sub: 'Internal limitations or resource vulnerabilities',
      items: '• Limited initial marketing budget & brand awareness\n• Dependency on a single cloud supplier channel\n• Gaps in mobile responsive user experience\n• Scalability bottlenecks during peak transaction load',
      color: '#FCEEE7',
      borderColor: '#D99379',
      headerColor: '#B55A43',
      x: startX + quadWidth + gap,
      y: topContentY
    },
    {
      title: 'OPPORTUNITIES (External)',
      sub: 'Favorable external market trends & growth vectors',
      items: '• Emerging expansion in underserved international markets\n• Shifting user demand towards privacy and sustainability\n• Strategic partnerships with universities and ecosystems\n• AI-driven workflow automation integrations',
      color: '#E4EFF0',
      borderColor: '#5B8C94',
      headerColor: '#366970',
      x: startX,
      y: topContentY + quadHeight + gap
    },
    {
      title: 'THREATS (External)',
      sub: 'External risks, competitors, and regulatory hurdles',
      items: '• Aggressive price cutting from well-funded competitors\n• Impending data compliance and regulatory policy changes\n• Macroeconomic fluctuations impacting discretionary budgets\n• Rapidly shifting technology standards and framework shifts',
      color: '#FAF0D7',
      borderColor: '#C7A35F',
      headerColor: '#8C6C26',
      x: startX + quadWidth + gap,
      y: topContentY + quadHeight + gap
    }
  ];

  quadrants.forEach((q) => {
    const card = createPanel(q.x, q.y, quadWidth, quadHeight, q.color, q.borderColor, 14);
    const hText = createSectionHeader(q.title, q.x + 20, q.y + 16, quadWidth - 40, q.headerColor, 15);
    const subText = new Textbox(q.sub, {
      left: q.x + 20,
      top: q.y + 38,
      width: quadWidth - 40,
      fontSize: 11.5,
      fontStyle: 'italic',
      fill: '#79766F',
      originX: 'left',
      originY: 'top',
      selectable: true,
      evented: true
    });
    const bodyText = createBodyText(q.items, q.x + 20, q.y + 68, quadWidth - 40, '#30312D', 13, 1.4);

    canvas.add(card, hText, subText, bodyText);
  });

  canvas.renderAll();
}

/**
 * 6. Venn Diagram Comparison template
 */
export function createVennDiagram(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;
  const radius = 210;

  const title = createTitle('Venn Diagram Comparative Analysis', startX, startY, 650);
  const subtitle = createSubtitle('Two-set comparative analysis comparing Concept A, Concept B, and shared intersecting principles', startX, startY + 34, 850);
  canvas.add(title, subtitle);

  const circleTop = startY + 70;

  // Left Circle A (translucent)
  const circleA = new Circle({
    left: 160,
    top: circleTop,
    radius,
    fill: 'rgba(119, 125, 94, 0.22)',
    stroke: '#777D5E',
    strokeWidth: 2.5,
    originX: 'left',
    originY: 'top',
    selectable: false,
    evented: false
  });

  // Right Circle B (translucent)
  const circleB = new Circle({
    left: 450,
    top: circleTop,
    radius,
    fill: 'rgba(217, 147, 121, 0.22)',
    stroke: '#D99379',
    strokeWidth: 2.5,
    originX: 'left',
    originY: 'top',
    selectable: false,
    evented: false
  });

  canvas.add(circleA, circleB);

  // Circle A Header & Notes
  const titleA = new Textbox('Concept / Theory A', {
    left: 180,
    top: circleTop + 40,
    width: 220,
    fontSize: 16,
    fontWeight: 'bold',
    fill: '#5E6547',
    textAlign: 'center',
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });
  const notesA = createBodyText(
    '• Unique properties of A\n\n• Specific methodology\n\n• Advantages of Model A\n\n• Historical context',
    180,
    circleTop + 85,
    220,
    '#30312D',
    13,
    1.4
  );

  // Shared Intersection Notes
  const titleShared = new Textbox('Shared Commonalities', {
    left: 455,
    top: circleTop + 70,
    width: 120,
    fontSize: 13.5,
    fontWeight: 'bold',
    fill: '#30312D',
    textAlign: 'center',
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });
  const notesShared = new Textbox('★ Core overlapping principles\n\n★ Common assumptions\n\n★ Shared mathematical basis', {
    left: 455,
    top: circleTop + 115,
    width: 120,
    fontSize: 12,
    fill: '#30312D',
    lineHeight: 1.35,
    textAlign: 'center',
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });

  // Circle B Header & Notes
  const titleB = new Textbox('Concept / Theory B', {
    left: 630,
    top: circleTop + 40,
    width: 220,
    fontSize: 16,
    fontWeight: 'bold',
    fill: '#B55A43',
    textAlign: 'center',
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });
  const notesB = createBodyText(
    '• Unique properties of B\n\n• Specific methodology\n\n• Advantages of Model B\n\n• Modern adaptations',
    630,
    circleTop + 85,
    220,
    '#30312D',
    13,
    1.4
  );

  canvas.add(titleA, notesA, titleShared, notesShared, titleB, notesB);
  canvas.renderAll();
}

/**
 * 7. Semester Study & Project Roadmap template
 */
export function createProjectRoadmap(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;
  const totalWidth = 1080;
  const phaseHeight = 110;
  const gapY = 16;

  const title = createTitle('Project Roadmap & Semester Study Milestones', startX, startY, 700);
  const subtitle = createSubtitle('Timeline and milestone tracker for semester thesis, software engineering sprints, or capstone deliverables', startX, startY + 34, 850);
  canvas.add(title, subtitle);

  const topContentY = startY + 70;

  // Timeline Header Bar (Weeks 1-12)
  const timeBar = createPanel(startX, topContentY, totalWidth, 38, '#F5EFE5', '#E2D8CA', 8);
  const timeText = new Textbox('WEEKS 1 – 3: Initiation     |     WEEKS 4 – 7: Execution     |     WEEKS 8 – 10: Testing     |     WEEKS 11 – 12: Defense', {
    left: startX,
    top: topContentY + 11,
    width: totalWidth,
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#79766F',
    textAlign: 'center',
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true
  });
  canvas.add(timeBar, timeText);

  const phases = [
    {
      title: 'Phase 1: Topic Selection & Literature Review',
      dates: 'Weeks 1 – 3 | Goal: Finalize Thesis Scope',
      tasks: '• Survey 25+ academic research papers  |  • Submit draft research proposal  |  • Obtain faculty advisor sign-off',
      color: '#FAF0D7',
      borderColor: '#D4BA82',
      badgeColor: '#5E6547'
    },
    {
      title: 'Phase 2: Experimentation & Prototype Architecture',
      dates: 'Weeks 4 – 7 | Goal: Build Core Functional System',
      tasks: '• Construct dataset & validation pipeline  |  • Implement machine learning baseline  |  • Run mid-semester audit',
      color: '#EAEEDD',
      borderColor: '#A8BC8D',
      badgeColor: '#5E6547'
    },
    {
      title: 'Phase 3: Results Analysis & Thesis Documentation',
      dates: 'Weeks 8 – 10 | Goal: Synthesize Findings',
      tasks: '• Statistical significance testing (p < 0.05)  |  • Draft Chapters 3, 4 & 5  |  • Peer review feedback integration',
      color: '#E4EFF0',
      borderColor: '#8FBAC2',
      badgeColor: '#366970'
    },
    {
      title: 'Phase 4: Final Presentation & Defense Preparation',
      dates: 'Weeks 11 – 12 | Goal: Successful Defense',
      tasks: '• Design slide deck & interactive demo  |  • Mock defense rehearsal with panel  |  • Final thesis bound copy submission',
      color: '#FCEEE7',
      borderColor: '#DEB2A4',
      badgeColor: '#B55A43'
    }
  ];

  phases.forEach((p, idx) => {
    const y = topContentY + 50 + idx * (phaseHeight + gapY);

    const card = createPanel(startX, y, totalWidth, phaseHeight, p.color, p.borderColor, 12);
    const hText = createSectionHeader(p.title, startX + 20, y + 16, 600, p.badgeColor, 15);
    const dText = new Textbox(p.dates, {
      left: startX + totalWidth - 320,
      top: y + 16,
      width: 300,
      fontSize: 12,
      fontStyle: 'italic',
      fill: '#79766F',
      textAlign: 'right',
      originX: 'left',
      originY: 'top',
      selectable: true,
      evented: true
    });
    const tasks = createBodyText(p.tasks, startX + 20, y + 54, totalWidth - 40, '#30312D', 13);

    canvas.add(card, hText, dText, tasks);
  });

  canvas.renderAll();
}

/**
 * 8. Concept Map & Entity Diagram template (Clean direct textboxes, zero group bugs)
 */
export function createConceptMap(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;

  const title = createTitle('Concept Map & Theoretical Relationships', startX, startY, 650);
  const subtitle = createSubtitle('Hierarchical knowledge graph linking core principle to axioms, methodologies, applications, and limitations', startX, startY + 34, 850);
  canvas.add(title, subtitle);

  const centerX = 580;
  const centerY = 380;

  const satellites = [
    { title: 'Domain 1: Axioms & Laws', sub: '• Foundation principles\n• Fundamental equations', x: 120, y: 150, color: '#EAEEDD', border: '#777D5E' },
    { title: 'Domain 2: Methodology', sub: '• Empirical experiments\n• Quantitative tests', x: 820, y: 150, color: '#E4EFF0', border: '#5B8C94' },
    { title: 'Domain 3: Applications', sub: '• Real-world systems\n• Engineering practice', x: 120, y: 510, color: '#FCEEE7', border: '#D99379' },
    { title: 'Domain 4: Limitations', sub: '• Boundary conditions\n• Known anomalies', x: 820, y: 510, color: '#FAF0D7', border: '#C7A35F' }
  ];

  // Connector lines added first (sitting behind cards)
  satellites.forEach((s) => {
    const line = new Line([centerX, centerY, s.x + 110, s.y + 45], {
      stroke: '#B8AFA2',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false
    });
    canvas.add(line);
  });

  // Center Core Theory Node at (460, 335) [240x90]
  const coreBg = createNodeShape(240, 90, 460, 335, '#FAF0D7', '#777D5E', 20);
  const coreText = createEditableNodeText('CORE THEORY\nPrincipal Phenomenon', 460, 356, 240, 15, '#30312D');
  canvas.add(coreBg, coreText);

  // 4 Satellite Theoretical Domains
  satellites.forEach((s) => {
    const sBg = createNodeShape(220, 90, s.x, s.y, s.color, s.border, 14);
    const sText = createEditableNodeText(`${s.title}\n${s.sub}`, s.x + 12, s.y + 14, 196, 12.5, '#30312D', 'left');
    canvas.add(sBg, sText);
  });

  canvas.renderAll();
}

/**
 * 9. Mind Map & Brainstorm template (Clean direct textboxes, zero group bugs)
 */
export function createMindMap(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;

  const title = createTitle('Mind Map & Brainstorm Ideation', startX, startY, 650);
  const subtitle = createSubtitle('Explore branching ideas, themes, and sub-points around a central core concept', startX, startY + 34, 850);
  canvas.add(title, subtitle);

  const centerX = 580;
  const centerY = 380;

  const branches = [
    { label: 'Theme 1: Research', sub: '• Literature survey\n• Field interviews', x: 140, y: 160, color: '#EAEEDD', borderColor: '#777D5E' },
    { label: 'Theme 2: Design', sub: '• User journey maps\n• Wireframe models', x: 810, y: 160, color: '#FCEEE7', borderColor: '#D99379' },
    { label: 'Theme 3: Strategy', sub: '• Value proposition\n• Market validation', x: 140, y: 500, color: '#FCEEE7', borderColor: '#D99379' },
    { label: 'Theme 4: Execution', sub: '• Milestones plan\n• Deliverables audit', x: 810, y: 500, color: '#EAEEDD', borderColor: '#777D5E' }
  ];

  // Connector lines added first (behind bubbles)
  branches.forEach((b) => {
    const line = new Line([centerX, centerY, b.x + 105, b.y + 43], {
      stroke: '#C2B8A8',
      strokeWidth: 2,
      strokeDashArray: [4, 4],
      selectable: false
    });
    canvas.add(line);
  });

  // Central Bubble at (470, 335) [220x90]
  const centerBg = createNodeShape(220, 90, 470, 335, '#FAF0D7', '#777D5E', 24);
  const centerText = createEditableNodeText('Central Idea / Thesis', 470, 368, 220, 16, '#30312D');
  canvas.add(centerBg, centerText);

  branches.forEach((b) => {
    const bBg = createNodeShape(210, 86, b.x, b.y, b.color, b.borderColor, 16);
    const bText = createEditableNodeText(`${b.label}\n${b.sub}`, b.x + 12, b.y + 16, 186, 12.5, '#30312D', 'left');
    canvas.add(bBg, bText);
  });

  canvas.renderAll();
}

/**
 * 10. Storyboard & Visual Scene Frames template
 */
export function createStoryboard(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;
  const frameWidth = 340;
  const frameHeight = 260;
  const gapX = 30;
  const gapY = 30;

  const title = createTitle('Storyboard & Visual Scene Frames', startX, startY, 650);
  const subtitle = createSubtitle('6 structured frames for camera shots, sequence illustrations, and narrative descriptions', startX, startY + 34, 850);
  canvas.add(title, subtitle);

  const topContentY = startY + 70;

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const idx = row * 3 + col + 1;
      const x = startX + col * (frameWidth + gapX);
      const y = topContentY + row * (frameHeight + gapY);

      // Outer Frame (non-blocking)
      const frameRect = createPanel(x, y, frameWidth, frameHeight, '#FFFEFA', '#E2D8CA', 10);

      // Drawing sketch box inside
      const sketchBox = createPanel(x + 14, y + 14, frameWidth - 28, frameHeight - 88, '#FAF6EE', '#EBE2D5', 6);

      // Scene caption label (editable)
      const caption = createBodyText(
        `Scene ${idx}: Action Description\nCamera angle / timing / dialogue notes`,
        x + 14,
        y + frameHeight - 64,
        frameWidth - 28,
        '#4A4843',
        12,
        1.35
      );

      canvas.add(frameRect, sketchBox, caption);
    }
  }

  canvas.renderAll();
}

/**
 * 11. Project Kanban Board template (Clean direct textboxes, zero group bugs)
 */
export function createKanbanBoard(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 40;
  const colWidth = 340;
  const colGap = 30;
  const colHeight = 600;

  const title = createTitle('Project Kanban Board', startX, startY, 650);
  const subtitle = createSubtitle('Agile task columns: To Do, In Progress, and Completed Deliverables', startX, startY + 34, 850);
  canvas.add(title, subtitle);

  const topContentY = startY + 70;

  const columns = [
    { title: 'To Do', color: '#FAF0D7', sample: 'Literature survey\nResearch proposal draft' },
    { title: 'In Progress', color: '#EAEEDD', sample: 'Algorithm implementation\nData collection pipeline' },
    { title: 'Done', color: '#FCEEE7', sample: 'Thesis outline approval\nDataset preprocessing' }
  ];

  columns.forEach((col, idx) => {
    const x = startX + idx * (colWidth + colGap);

    // Column container (non-blocking)
    const card = createPanel(x, topContentY, colWidth, colHeight, '#FAF6EE', '#E2D8CA', 14);

    // Header badge (non-blocking)
    const badge = createPanel(x + 16, topContentY + 16, colWidth - 32, 38, col.color, '#DCD1C2', 8);

    const headerText = new Textbox(col.title, {
      left: x + 16,
      top: topContentY + 25,
      width: colWidth - 32,
      fontSize: 14,
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: 'bold',
      fill: '#30312D',
      textAlign: 'center',
      originX: 'left',
      originY: 'top',
      selectable: true,
      evented: true
    });

    // Sample Task Card Background
    const taskBg = createPanel(x + 16, topContentY + 70, colWidth - 32, 88, '#FFFEFA', '#E8DED2', 8);

    // Sample Task Textbox (fully interactive and editable)
    const taskText = createBodyText(
      col.sample,
      x + 28,
      topContentY + 86,
      colWidth - 56,
      '#4A4843',
      13,
      1.4
    );

    canvas.add(card, badge, headerText, taskBg, taskText);
  });

  canvas.renderAll();
}
