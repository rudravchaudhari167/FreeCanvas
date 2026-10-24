import {
  Canvas as FabricCanvas,
  Rect,
  Textbox,
  Line,
  Polygon,
  Circle,
  Group
} from 'fabric';

/**
 * Creates a Weekly Planner template across Monday - Sunday with editable task lists
 */
export function createWeeklyPlanner(canvas: FabricCanvas): void {
  const startX = 60;
  const startY = 60;
  const colWidth = 150;
  const colGap = 16;
  const cardHeight = 540;

  // Header Title
  const title = new Textbox('Weekly Schedule & Study Planner', {
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
    const colY = startY + 50;

    // Background Column Card (non-blocking layout guide)
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
      selectable: false,
      evented: false
    });

    // Column Header Tag (non-blocking)
    const headerRect = new Rect({
      left: colX,
      top: colY,
      width: colWidth,
      height: 42,
      fill: day.color,
      stroke: '#E8DED2',
      strokeWidth: 1.5,
      rx: 12,
      ry: 12,
      selectable: false,
      evented: false
    });

    // Day Name
    const dayText = new Textbox(day.name, {
      left: colX + 10,
      top: colY + 12,
      width: colWidth - 20,
      fontSize: 14,
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: 'bold',
      fill: '#30312D',
      textAlign: 'center'
    });

    // Task Items Textbox (fully interactive and editable)
    const taskText = new Textbox('☐ Lecture 1\n\n☐ Assignment\n\n☐ Reading\n\n☐ Study Group', {
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
  const title = new Textbox('Lecture / Subject Title', {
    left: startX,
    top: startY,
    width: 600,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });

  const metaText = new Textbox('Course: ______________  |  Professor: ______________  |  Date: ______________', {
    left: startX,
    top: startY + 38,
    width: 750,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#79766F'
  });

  canvas.add(title, metaText);

  // Cue Card Background (non-blocking layout panel)
  const cueCard = new Rect({
    left: startX,
    top: startY + 75,
    width: cueWidth,
    height: notesHeight,
    fill: '#FAF5EE',
    stroke: '#E5DCD0',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10,
    selectable: false,
    evented: false
  });

  const cueHeader = new Textbox('Cues & Key Questions', {
    left: startX + 16,
    top: startY + 90,
    width: cueWidth - 32,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#5E6547'
  });

  // Editable cue content
  const cueContent = new Textbox('• What is the main thesis?\n\n• Key formulas or dates\n\n• Potential exam questions\n\n• Definitions & terms\n\n• Connections to prior topic', {
    left: startX + 16,
    top: startY + 125,
    width: cueWidth - 32,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#4A4843',
    lineHeight: 1.35
  });

  // Main Notes Card Background (non-blocking layout panel)
  const mainCard = new Rect({
    left: startX + cueWidth + 18,
    top: startY + 75,
    width: mainWidth,
    height: notesHeight,
    fill: '#FFFEFA',
    stroke: '#E5DCD0',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10,
    selectable: false,
    evented: false
  });

  const mainHeader = new Textbox('Main Lecture Notes', {
    left: startX + cueWidth + 36,
    top: startY + 90,
    width: mainWidth - 36,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });

  // Editable main lecture notes
  const mainContent = new Textbox('1. Detailed lecture notes, formulas, and proofs go here.\n\n2. Draw diagrams or chemical/algorithm flowcharts beside steps.\n\n3. Use concise outlines and bulleted hierarchies.\n\n4. Write down references, citations, and slide numbers.\n\n5. Star (*) key concepts emphasized by the instructor.', {
    left: startX + cueWidth + 36,
    top: startY + 125,
    width: mainWidth - 52,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#4A4843',
    lineHeight: 1.35
  });

  // Summary Card Background (non-blocking layout panel)
  const summaryCard = new Rect({
    left: startX,
    top: startY + 75 + notesHeight + 16,
    width: totalWidth,
    height: summaryHeight,
    fill: '#F5EFE5',
    stroke: '#E5DCD0',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10,
    selectable: false,
    evented: false
  });

  const summaryHeader = new Textbox('Summary & Review Takeaways', {
    left: startX + 18,
    top: startY + 75 + notesHeight + 28,
    width: totalWidth - 36,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#777D5E'
  });

  const summaryContent = new Textbox('Condense the entire lecture into 2-3 core takeaway sentences. What are the fundamental principles and how do they apply to problem solving?', {
    left: startX + 18,
    top: startY + 75 + notesHeight + 58,
    width: totalWidth - 36,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#4A4843',
    lineHeight: 1.4
  });

  canvas.add(
    cueCard, cueHeader, cueContent,
    mainCard, mainHeader, mainContent,
    summaryCard, summaryHeader, summaryContent
  );
  canvas.renderAll();
}

/**
 * Creates Flowchart & Algorithm Diagram template
 */
export function createFlowchart(canvas: FabricCanvas): void {
  const startX = 120;
  const startY = 60;

  const title = new Textbox('Algorithm & Logic Flowchart', {
    left: startX,
    top: startY,
    width: 600,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });
  canvas.add(title);

  // Helper to create grouped interactive flowchart node
  const createNode = (shape: any, textStr: string, left: number, top: number) => {
    const text = new Textbox(textStr, {
      width: shape.width - 20,
      left: 10,
      top: Math.max(10, (shape.height - 30) / 2),
      fontSize: 13,
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: '600',
      fill: '#30312D',
      textAlign: 'center'
    });
    return new Group([shape, text], {
      left,
      top,
      subTargetCheck: true,
      interactive: true
    });
  };

  // Node 1: Start (Terminal Pill)
  const startPill = new Rect({
    width: 170,
    height: 56,
    fill: '#FAF0D7',
    stroke: '#777D5E',
    strokeWidth: 2,
    rx: 28,
    ry: 28
  });
  const nodeStart = createNode(startPill, 'START', startX + 380, startY + 60);

  // Node 2: Input / Read Parallelogram
  const inputPoly = new Polygon([
    { x: 24, y: 0 },
    { x: 190, y: 0 },
    { x: 166, y: 56 },
    { x: 0, y: 56 }
  ], {
    fill: '#EAEEDD',
    stroke: '#5E6547',
    strokeWidth: 1.8
  });
  const nodeInput = createNode(inputPoly, 'Read Input Data', startX + 370, startY + 160);

  // Node 3: Process Box
  const processRect = new Rect({
    width: 180,
    height: 60,
    fill: '#FFFEFA',
    stroke: '#777D5E',
    strokeWidth: 2,
    rx: 8,
    ry: 8
  });
  const nodeProcess = createNode(processRect, 'Execute Computation\n& Validate', startX + 375, startY + 260);

  // Node 4: Decision Diamond
  const decisionPoly = new Polygon([
    { x: 95, y: 0 },
    { x: 190, y: 55 },
    { x: 95, y: 110 },
    { x: 0, y: 55 }
  ], {
    fill: '#FCEEE7',
    stroke: '#D99379',
    strokeWidth: 2
  });
  const nodeDecision = createNode(decisionPoly, 'Is Valid / Solved?', startX + 370, startY + 360);

  // Node 5: Success / Result Process
  const outputRect = new Rect({
    width: 170,
    height: 56,
    fill: '#EAEEDD',
    stroke: '#5E6547',
    strokeWidth: 1.8,
    rx: 8,
    ry: 8
  });
  const nodeOutput = createNode(outputRect, 'Output Result', startX + 380, startY + 510);

  // Node 6: Fallback Loop Step
  const fallbackRect = new Rect({
    width: 160,
    height: 54,
    fill: '#FAF5EE',
    stroke: '#D99379',
    strokeWidth: 1.8,
    rx: 8,
    ry: 8
  });
  const nodeFallback = createNode(fallbackRect, 'Adjust Parameters\n& Retry', startX + 680, startY + 385);

  // Node 7: End (Terminal Pill)
  const endPill = new Rect({
    width: 170,
    height: 56,
    fill: '#FAF0D7',
    stroke: '#777D5E',
    strokeWidth: 2,
    rx: 28,
    ry: 28
  });
  const nodeEnd = createNode(endPill, 'END / RETURN', startX + 380, startY + 610);

  // Connecting Lines & Arrows
  const lines = [
    // Start -> Input
    new Line([startX + 465, startY + 116, startX + 465, startY + 160], { stroke: '#777D5E', strokeWidth: 2 }),
    // Input -> Process
    new Line([startX + 465, startY + 216, startX + 465, startY + 260], { stroke: '#777D5E', strokeWidth: 2 }),
    // Process -> Decision
    new Line([startX + 465, startY + 320, startX + 465, startY + 360], { stroke: '#777D5E', strokeWidth: 2 }),
    // Decision -> Output (YES)
    new Line([startX + 465, startY + 470, startX + 465, startY + 510], { stroke: '#5E6547', strokeWidth: 2 }),
    // Decision -> Fallback (NO)
    new Line([startX + 560, startY + 415, startX + 680, startY + 415], { stroke: '#D99379', strokeWidth: 2 }),
    // Fallback back up to Process
    new Line([startX + 760, startY + 385, startX + 760, startY + 290], { stroke: '#D99379', strokeWidth: 2 }),
    new Line([startX + 760, startY + 290, startX + 555, startY + 290], { stroke: '#D99379', strokeWidth: 2 }),
    // Output -> End
    new Line([startX + 465, startY + 566, startX + 465, startY + 610], { stroke: '#777D5E', strokeWidth: 2 })
  ];

  const yesLabel = new Textbox('YES', { left: startX + 475, top: startY + 480, fontSize: 11, fontWeight: 'bold', fill: '#5E6547' });
  const noLabel = new Textbox('NO', { left: startX + 580, top: startY + 395, fontSize: 11, fontWeight: 'bold', fill: '#D99379' });

  lines.forEach(l => canvas.add(l));
  canvas.add(yesLabel, noLabel);
  canvas.add(nodeStart, nodeInput, nodeProcess, nodeDecision, nodeOutput, nodeFallback, nodeEnd);

  canvas.renderAll();
}

/**
 * Creates Lab Report & Scientific Experiment template
 */
export function createLabReport(canvas: FabricCanvas): void {
  const startX = 70;
  const startY = 60;
  const colWidth = 515;
  const gapX = 24;

  const title = new Textbox('Scientific Lab Report & Experiment Protocol', {
    left: startX,
    top: startY,
    width: 700,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });

  const metaText = new Textbox('Course: ______________  |  Experiment #: ______  |  Lab Partner: ______________  |  Date: ______________', {
    left: startX,
    top: startY + 38,
    width: 850,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#79766F'
  });

  canvas.add(title, metaText);

  // Section 1: Objective & Hypothesis
  const sec1Card = new Rect({
    left: startX,
    top: startY + 75,
    width: colWidth,
    height: 180,
    fill: '#FAF5EE',
    stroke: '#E2D8CA',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10,
    selectable: false,
    evented: false
  });
  const sec1Header = new Textbox('1. Objective & Hypothesis', {
    left: startX + 16,
    top: startY + 90,
    width: colWidth - 32,
    fontSize: 14,
    fontWeight: 'bold',
    fill: '#5E6547'
  });
  const sec1Body = new Textbox('• Objective: Determine the rate constant and reaction kinetics.\n• Hypothesis: If the temperature increases by 10°C, the reaction rate will double as predicted by the Arrhenius equation.', {
    left: startX + 16,
    top: startY + 120,
    width: colWidth - 32,
    fontSize: 12.5,
    fill: '#4A4843',
    lineHeight: 1.35
  });

  // Section 2: Materials & Apparatus
  const sec2Card = new Rect({
    left: startX + colWidth + gapX,
    top: startY + 75,
    width: colWidth,
    height: 180,
    fill: '#FFFEFA',
    stroke: '#E2D8CA',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10,
    selectable: false,
    evented: false
  });
  const sec2Header = new Textbox('2. Apparatus & Chemical Reagents', {
    left: startX + colWidth + gapX + 16,
    top: startY + 90,
    width: colWidth - 32,
    fontSize: 14,
    fontWeight: 'bold',
    fill: '#30312D'
  });
  const sec2Body = new Textbox('• 50mL Burette & Magnetic Stirrer\n• 0.1M Sodium Hydroxide (NaOH)\n• Spectrophotometer (λ = 520nm)\n• Thermocouple Probe & Stopwatch', {
    left: startX + colWidth + gapX + 16,
    top: startY + 120,
    width: colWidth - 32,
    fontSize: 12.5,
    fill: '#4A4843',
    lineHeight: 1.35
  });

  // Section 3: Experimental Procedure
  const sec3Card = new Rect({
    left: startX,
    top: startY + 275,
    width: colWidth,
    height: 200,
    fill: '#FFFEFA',
    stroke: '#E2D8CA',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10,
    selectable: false,
    evented: false
  });
  const sec3Header = new Textbox('3. Methodology & Procedure Steps', {
    left: startX + 16,
    top: startY + 290,
    width: colWidth - 32,
    fontSize: 14,
    fontWeight: 'bold',
    fill: '#30312D'
  });
  const sec3Body = new Textbox('Step 1: Calibrate probe with standard buffer solution (pH 7.0).\nStep 2: Add 25mL reagent into water bath at 25°C.\nStep 3: Initiate reaction and record absorbance every 30 seconds.\nStep 4: Repeat 3 trials across 35°C, 45°C, and 55°C.', {
    left: startX + 16,
    top: startY + 320,
    width: colWidth - 32,
    fontSize: 12.5,
    fill: '#4A4843',
    lineHeight: 1.35
  });

  // Section 4: Data & Observation Table
  const sec4Card = new Rect({
    left: startX + colWidth + gapX,
    top: startY + 275,
    width: colWidth,
    height: 200,
    fill: '#FAF5EE',
    stroke: '#E2D8CA',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10,
    selectable: false,
    evented: false
  });
  const sec4Header = new Textbox('4. Data & Observation Table', {
    left: startX + colWidth + gapX + 16,
    top: startY + 290,
    width: colWidth - 32,
    fontSize: 14,
    fontWeight: 'bold',
    fill: '#5E6547'
  });
  const sec4Body = new Textbox('Trial | Temp (°C) | Initial Rate (M/s) | Final Abs\n----------------------------------------------------\n  1   |   25.0    |    1.42 × 10⁻³    |   0.824\n  2   |   35.2    |    2.86 × 10⁻³    |   0.819\n  3   |   45.1    |    5.71 × 10⁻³    |   0.828', {
    left: startX + colWidth + gapX + 16,
    top: startY + 320,
    width: colWidth - 32,
    fontSize: 12,
    fontFamily: 'monospace',
    fill: '#4A4843',
    lineHeight: 1.4
  });

  // Section 5: Conclusion & Discussion
  const sec5Card = new Rect({
    left: startX,
    top: startY + 495,
    width: colWidth * 2 + gapX,
    height: 150,
    fill: '#FAF0D7',
    stroke: '#E2D8CA',
    strokeWidth: 1.5,
    rx: 10,
    ry: 10,
    selectable: false,
    evented: false
  });
  const sec5Header = new Textbox('5. Discussion, Error Analysis & Conclusion', {
    left: startX + 16,
    top: startY + 510,
    width: colWidth * 2,
    fontSize: 14,
    fontWeight: 'bold',
    fill: '#5E6547'
  });
  const sec5Body = new Textbox('• Result: Activation energy (Ea) was calculated to be 52.4 kJ/mol, matching theoretical values within 3.2% error.\n• Sources of Error: Heat loss to surroundings during transfer; minor meniscus reading parallax in trial 2.\n• Conclusion: The experimental rate law confirmed first-order dependence on reactant concentration.', {
    left: startX + 16,
    top: startY + 538,
    width: colWidth * 2 - 32,
    fontSize: 12.5,
    fill: '#4A4843',
    lineHeight: 1.35
  });

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
 * Creates SWOT Analysis Matrix template
 */
export function createSwotMatrix(canvas: FabricCanvas): void {
  const startX = 100;
  const startY = 60;
  const quadWidth = 480;
  const quadHeight = 270;
  const gap = 20;

  const title = new Textbox('SWOT Strategic Analysis Matrix', {
    left: startX,
    top: startY,
    width: 600,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });
  canvas.add(title);

  const quadrants = [
    {
      title: 'STRENGTHS (Internal)',
      sub: 'Helpful attributes of the organization/project',
      items: '• Proprietary technology & IP assets\n• High customer retention & brand loyalty\n• Experienced cross-functional team\n• Lean operational cost structure',
      color: '#EAEEDD',
      borderColor: '#777D5E',
      headerColor: '#5E6547',
      x: startX,
      y: startY + 55
    },
    {
      title: 'WEAKNESSES (Internal)',
      sub: 'Harmful attributes or internal limitations',
      items: '• Limited marketing budget & brand reach\n• Dependency on single supplier channel\n• Gaps in mobile user experience\n• Scalability bottlenecks during peak load',
      color: '#FCEEE7',
      borderColor: '#D99379',
      headerColor: '#B55A43',
      x: startX + quadWidth + gap,
      y: startY + 55
    },
    {
      title: 'OPPORTUNITIES (External)',
      sub: 'Favorable external market trends to capture',
      items: '• Emerging expansion in international markets\n• Shifting consumer demand towards sustainability\n• Strategic partnership with key ecosystem players\n• AI-driven workflow automation integrations',
      color: '#E4EFF0',
      borderColor: '#5B8C94',
      headerColor: '#366970',
      x: startX,
      y: startY + 55 + quadHeight + gap
    },
    {
      title: 'THREATS (External)',
      sub: 'External risks and competitive obstacles',
      items: '• Aggressive pricing from well-funded competitors\n• Impending regulatory compliance changes\n• Economic fluctuations impacting customer spend\n• Rapidly shifting technology standards',
      color: '#FAF0D7',
      borderColor: '#C7A35F',
      headerColor: '#8C6C26',
      x: startX + quadWidth + gap,
      y: startY + 55 + quadHeight + gap
    }
  ];

  quadrants.forEach((q) => {
    // Quadrant Card Background (non-blocking)
    const card = new Rect({
      left: q.x,
      top: q.y,
      width: quadWidth,
      height: quadHeight,
      fill: q.color,
      stroke: q.borderColor,
      strokeWidth: 2,
      rx: 14,
      ry: 14,
      selectable: false,
      evented: false
    });

    // Quadrant Title
    const hText = new Textbox(q.title, {
      left: q.x + 20,
      top: q.y + 18,
      width: quadWidth - 40,
      fontSize: 15,
      fontWeight: 'bold',
      fill: q.headerColor
    });

    const subText = new Textbox(q.sub, {
      left: q.x + 20,
      top: q.y + 40,
      width: quadWidth - 40,
      fontSize: 11.5,
      fontStyle: 'italic',
      fill: '#79766F'
    });

    // Editable Items
    const bodyText = new Textbox(q.items, {
      left: q.x + 20,
      top: q.y + 74,
      width: quadWidth - 40,
      fontSize: 13,
      fill: '#30312D',
      lineHeight: 1.4
    });

    canvas.add(card, hText, subText, bodyText);
  });

  canvas.renderAll();
}

/**
 * Creates Venn Diagram Comparison template
 */
export function createVennDiagram(canvas: FabricCanvas): void {
  const startX = 120;
  const startY = 60;
  const radius = 210;

  const title = new Textbox('Venn Diagram Comparative Analysis', {
    left: startX,
    top: startY,
    width: 600,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });
  canvas.add(title);

  // Left Circle A (translucent)
  const circleA = new Circle({
    left: startX + 100,
    top: startY + 80,
    radius,
    fill: 'rgba(119, 125, 94, 0.22)',
    stroke: '#777D5E',
    strokeWidth: 2.5,
    selectable: false,
    evented: false
  });

  // Right Circle B (translucent)
  const circleB = new Circle({
    left: startX + 380,
    top: startY + 80,
    radius,
    fill: 'rgba(217, 147, 121, 0.22)',
    stroke: '#D99379',
    strokeWidth: 2.5,
    selectable: false,
    evented: false
  });

  canvas.add(circleA, circleB);

  // Circle A Header & Notes
  const titleA = new Textbox('Concept / Theory A', {
    left: startX + 140,
    top: startY + 110,
    width: 200,
    fontSize: 16,
    fontWeight: 'bold',
    fill: '#5E6547',
    textAlign: 'center'
  });
  const notesA = new Textbox('• Unique properties of A\n• Specific methodology\n• Advantages of Model A\n• Historical context', {
    left: startX + 130,
    top: startY + 160,
    width: 210,
    fontSize: 13,
    fill: '#30312D',
    lineHeight: 1.4
  });

  // Shared Intersection Notes
  const titleShared = new Textbox('Shared Commonalities', {
    left: startX + 390,
    top: startY + 140,
    width: 180,
    fontSize: 14,
    fontWeight: 'bold',
    fill: '#30312D',
    textAlign: 'center'
  });
  const notesShared = new Textbox('★ Core overlapping principles\n★ Common assumptions\n★ Shared mathematical basis', {
    left: startX + 375,
    top: startY + 190,
    width: 190,
    fontSize: 12.5,
    fill: '#30312D',
    lineHeight: 1.4,
    textAlign: 'center'
  });

  // Circle B Header & Notes
  const titleB = new Textbox('Concept / Theory B', {
    left: startX + 620,
    top: startY + 110,
    width: 200,
    fontSize: 16,
    fontWeight: 'bold',
    fill: '#B55A43',
    textAlign: 'center'
  });
  const notesB = new Textbox('• Unique properties of B\n• Specific methodology\n• Advantages of Model B\n• Modern adaptations', {
    left: startX + 620,
    top: startY + 160,
    width: 210,
    fontSize: 13,
    fill: '#30312D',
    lineHeight: 1.4
  });

  canvas.add(titleA, notesA, titleShared, notesShared, titleB, notesB);
  canvas.renderAll();
}

/**
 * Creates Project Roadmap & Semester Study Schedule template
 */
export function createProjectRoadmap(canvas: FabricCanvas): void {
  const startX = 80;
  const startY = 60;
  const totalWidth = 1040;
  const phaseHeight = 110;
  const gapY = 20;

  const title = new Textbox('Project Roadmap & Semester Study Milestones', {
    left: startX,
    top: startY,
    width: 700,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });
  canvas.add(title);

  // Timeline Header Bar (Weeks 1-12)
  const timeBar = new Rect({
    left: startX,
    top: startY + 50,
    width: totalWidth,
    height: 38,
    fill: '#F5EFE5',
    stroke: '#E2D8CA',
    strokeWidth: 1.5,
    rx: 8,
    ry: 8,
    selectable: false,
    evented: false
  });
  const timeText = new Textbox('WEEKS 1 – 3: Initiation     |     WEEKS 4 – 7: Execution     |     WEEKS 8 – 10: Testing     |     WEEKS 11 – 12: Defense', {
    left: startX + 16,
    top: startY + 62,
    width: totalWidth - 32,
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#79766F',
    textAlign: 'center'
  });
  canvas.add(timeBar, timeText);

  const phases = [
    {
      title: 'Phase 1: Topic Selection & Literature Review',
      dates: 'Weeks 1 – 3 | Goal: Finalize Thesis Scope',
      tasks: '• Survey 25+ academic research papers  |  • Submit draft research proposal  |  • Obtain faculty advisor approval',
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
    const y = startY + 105 + idx * (phaseHeight + gapY);

    const card = new Rect({
      left: startX,
      top: y,
      width: totalWidth,
      height: phaseHeight,
      fill: p.color,
      stroke: p.borderColor,
      strokeWidth: 1.5,
      rx: 12,
      ry: 12,
      selectable: false,
      evented: false
    });

    const hText = new Textbox(p.title, {
      left: startX + 20,
      top: y + 16,
      width: 600,
      fontSize: 15,
      fontWeight: 'bold',
      fill: p.badgeColor
    });

    const dText = new Textbox(p.dates, {
      left: startX + totalWidth - 320,
      top: y + 16,
      width: 300,
      fontSize: 12,
      fontStyle: 'italic',
      fill: '#79766F',
      textAlign: 'right'
    });

    const tasks = new Textbox(p.tasks, {
      left: startX + 20,
      top: y + 54,
      width: totalWidth - 40,
      fontSize: 13,
      fill: '#30312D'
    });

    canvas.add(card, hText, dText, tasks);
  });

  canvas.renderAll();
}

/**
 * Creates College Concept Map / Entity Diagram template
 */
export function createConceptMap(canvas: FabricCanvas): void {
  const centerX = 560;
  const centerY = 340;

  const title = new Textbox('Concept Map & Theoretical Relationships', {
    left: 80,
    top: 60,
    width: 600,
    fontSize: 26,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D'
  });
  canvas.add(title);

  // Center Core Theory Node
  const coreRect = new Rect({
    width: 240,
    height: 90,
    fill: '#FAF0D7',
    stroke: '#777D5E',
    strokeWidth: 2.5,
    rx: 20,
    ry: 20
  });
  const coreText = new Textbox('CORE THEORY\nPrincipal Phenomenon', {
    width: 220,
    left: 10,
    top: 22,
    fontSize: 16,
    fontWeight: 'bold',
    fill: '#30312D',
    textAlign: 'center'
  });
  const coreGroup = new Group([coreRect, coreText], {
    left: centerX - 120,
    top: centerY - 45,
    subTargetCheck: true,
    interactive: true
  });
  canvas.add(coreGroup);

  // 4 Satellite Theoretical Domains
  const satellites = [
    { title: 'Domain 1: Axioms & Laws', sub: '• Foundation principles\n• Fundamental equations', x: centerX - 380, y: centerY - 180, color: '#EAEEDD', border: '#777D5E' },
    { title: 'Domain 2: Methodology', sub: '• Empirical experiments\n• Quantitative tests', x: centerX + 180, y: centerY - 180, color: '#E4EFF0', border: '#5B8C94' },
    { title: 'Domain 3: Applications', sub: '• Real-world systems\n• Engineering practice', x: centerX - 380, y: centerY + 130, color: '#FCEEE7', border: '#D99379' },
    { title: 'Domain 4: Limitations', sub: '• Boundary conditions\n• Known anomalies', x: centerX + 180, y: centerY + 130, color: '#FAF0D7', border: '#C7A35F' }
  ];

  satellites.forEach((s) => {
    // Connector line with dash
    const line = new Line([centerX, centerY, s.x + 100, s.y + 40], {
      stroke: '#B8AFA2',
      strokeWidth: 2,
      strokeDashArray: [5, 5]
    });
    canvas.add(line);

    const sRect = new Rect({
      width: 210,
      height: 86,
      fill: s.color,
      stroke: s.border,
      strokeWidth: 2,
      rx: 14,
      ry: 14
    });
    const sText = new Textbox(`${s.title}\n${s.sub}`, {
      width: 190,
      left: 10,
      top: 14,
      fontSize: 12.5,
      fontWeight: '600',
      fill: '#30312D',
      lineHeight: 1.35
    });
    const sGroup = new Group([sRect, sText], {
      left: s.x,
      top: s.y,
      subTargetCheck: true,
      interactive: true
    });
    canvas.add(sGroup);
  });

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
    width: 220,
    height: 90,
    fill: '#FAF0D7',
    stroke: '#777D5E',
    strokeWidth: 2.5,
    rx: 24,
    ry: 24
  });

  const centerText = new Textbox('Central Idea / Thesis', {
    width: 200,
    left: 10,
    top: 30,
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#30312D',
    textAlign: 'center'
  });

  const centerGroup = new Group([centerRect, centerText], {
    left: centerX - 110,
    top: centerY - 45,
    subTargetCheck: true,
    interactive: true
  });
  canvas.add(centerGroup);

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
    canvas.add(line);

    const bCard = new Rect({
      width: 180,
      height: 80,
      fill: b.color,
      stroke: b.borderColor,
      strokeWidth: 1.5,
      rx: 16,
      ry: 16
    });

    const bText = new Textbox(`${b.label}\n• Key sub-point`, {
      width: 160,
      left: 10,
      top: 18,
      fontSize: 13,
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: '600',
      fill: '#30312D'
    });

    const bGroup = new Group([bCard, bText], {
      left: b.x,
      top: b.y,
      subTargetCheck: true,
      interactive: true
    });
    canvas.add(bGroup);
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

  const title = new Textbox('Storyboard & Visual Scene Frames', {
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

      // Outer Frame (non-blocking)
      const frameRect = new Rect({
        left: x,
        top: y,
        width: frameWidth,
        height: frameHeight,
        fill: '#FFFEFA',
        stroke: '#E2D8CA',
        strokeWidth: 1.5,
        rx: 10,
        ry: 10,
        selectable: false,
        evented: false
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
        ry: 6,
        selectable: false,
        evented: false
      });

      // Scene caption label (fully editable)
      const caption = new Textbox(`Scene ${idx}: Action Description\nCamera angle / timing / dialogue notes`, {
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
    { title: 'To Do', color: '#FAF0D7', sample: 'Literature survey\nResearch proposal draft' },
    { title: 'In Progress', color: '#EAEEDD', sample: 'Algorithm implementation\nData collection pipeline' },
    { title: 'Done', color: '#FCEEE7', sample: 'Thesis outline approval\nDataset preprocessing' }
  ];

  columns.forEach((col, idx) => {
    const x = startX + idx * (colWidth + colGap);
    const y = startY + 50;

    // Column container (non-blocking)
    const card = new Rect({
      left: x,
      top: y,
      width: colWidth,
      height: colHeight,
      fill: '#FAF6EE',
      stroke: '#E2D8CA',
      strokeWidth: 1.5,
      rx: 14,
      ry: 14,
      selectable: false,
      evented: false
    });

    // Header badge (non-blocking)
    const badge = new Rect({
      left: x + 16,
      top: y + 16,
      width: colWidth - 32,
      height: 38,
      fill: col.color,
      stroke: '#DCD1C2',
      strokeWidth: 1.5,
      rx: 8,
      ry: 8,
      selectable: false,
      evented: false
    });

    const headerText = new Textbox(col.title, {
      left: x + 24,
      top: y + 25,
      width: colWidth - 48,
      fontSize: 14,
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: 'bold',
      fill: '#30312D',
      textAlign: 'center',
      selectable: false,
      evented: false
    });

    // Sample Task Card (grouped and movable)
    const taskCardRect = new Rect({
      width: colWidth - 36,
      height: 90,
      fill: '#FFFEFA',
      stroke: '#E8DED2',
      strokeWidth: 1.5,
      rx: 8,
      ry: 8
    });

    const taskText = new Textbox(col.sample, {
      width: colWidth - 56,
      left: 10,
      top: 18,
      fontSize: 13,
      fontFamily: 'Plus Jakarta Sans',
      fill: '#4A4843',
      lineHeight: 1.4
    });

    const taskGroup = new Group([taskCardRect, taskText], {
      left: x + 18,
      top: y + 74,
      subTargetCheck: true,
      interactive: true
    });

    canvas.add(card, badge, headerText, taskGroup);
  });

  canvas.renderAll();
}
