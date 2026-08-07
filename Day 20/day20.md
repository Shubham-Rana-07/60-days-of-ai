<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
<title>Face Puzzle Game</title>
<style>
  :root{
    --primary:#6366f1;
    --primary-dark:#4338ca;
    --accent:#22c55e;
    --danger:#ef4444;
    --bg1:#4338ca;
    --bg2:#7c3aed;
    --card:#ffffff;
    --text:#1e1b2e;
    --muted:#6b7280;
    --radius:18px;
  }
  *{box-sizing:border-box;}
  html,body{
    margin:0;padding:0;
    min-height:100%;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    background:linear-gradient(135deg,var(--bg1),var(--bg2) 60%,#db2777);
    background-attachment:fixed;
    color:var(--text);
  }
  #app{
    min-height:100vh;
    display:flex;
    flex-direction:column;
    align-items:center;
    padding:20px 14px 40px;
  }
  h1.title{
    color:#fff;
    font-size:clamp(22px,5vw,32px);
    margin:6px 0 4px;
    text-align:center;
    letter-spacing:.5px;
    text-shadow:0 2px 10px rgba(0,0,0,.25);
  }
  p.subtitle{
    color:rgba(255,255,255,.85);
    margin:0 0 22px;
    font-size:14px;
    text-align:center;
  }
  .card{
    background:var(--card);
    border-radius:var(--radius);
    box-shadow:0 20px 50px rgba(0,0,0,.25);
    padding:22px;
    width:100%;
    max-width:560px;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:16px;
  }
  .hidden{display:none !important;}

  /* ---------- Camera Screen ---------- */
  .video-wrap{
    position:relative;
    width:100%;
    max-width:420px;
    aspect-ratio:1/1;
    border-radius:16px;
    overflow:hidden;
    background:#111;
    box-shadow:inset 0 0 0 4px rgba(99,102,241,.25);
  }
  #video{
    width:100%;
    height:100%;
    object-fit:cover;
    transform:scaleX(-1);
    display:block;
  }
  .video-wrap .face-guide{
    position:absolute;
    inset:8%;
    border:2px dashed rgba(255,255,255,.55);
    border-radius:50%;
    pointer-events:none;
  }
  .camera-status{
    font-size:13px;
    color:var(--muted);
    text-align:center;
    min-height:18px;
  }
  .btn-row{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    justify-content:center;
    width:100%;
  }
  button{
    font-family:inherit;
    cursor:pointer;
    border:none;
    outline:none;
  }
  .btn{
    background:var(--primary);
    color:#fff;
    padding:12px 22px;
    border-radius:12px;
    font-size:15px;
    font-weight:600;
    transition:transform .12s ease, background .2s ease, box-shadow .2s ease;
    box-shadow:0 6px 16px rgba(99,102,241,.35);
  }
  .btn:hover{background:var(--primary-dark);transform:translateY(-1px);}
  .btn:active{transform:translateY(0);}
  .btn.secondary{
    background:#eef0ff;
    color:var(--primary-dark);
    box-shadow:none;
  }
  .btn.secondary:hover{background:#e0e3ff;}
  .btn.success{background:var(--accent);box-shadow:0 6px 16px rgba(34,197,94,.35);}
  .btn.success:hover{background:#16a34a;}
  .btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}

  .upload-fallback{
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:8px;
    font-size:13px;
    color:var(--muted);
  }
  .upload-fallback label{
    background:#eef0ff;
    color:var(--primary-dark);
    padding:10px 18px;
    border-radius:10px;
    font-weight:600;
    cursor:pointer;
  }
  #fileInput{display:none;}

  /* ---------- Preview / difficulty screen ---------- */
  .preview-img-wrap{
    width:100%;
    max-width:380px;
    aspect-ratio:1/1;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 8px 24px rgba(0,0,0,.2);
  }
  .preview-img-wrap img{
    width:100%;height:100%;
    object-fit:cover;
    display:block;
  }
  .diff-row{
    display:flex;
    gap:10px;
    justify-content:center;
    flex-wrap:wrap;
  }
  .diff-btn{
    padding:12px 18px;
    border-radius:12px;
    background:#f3f4f6;
    color:var(--text);
    font-weight:700;
    font-size:15px;
    border:2px solid transparent;
    transition:all .15s ease;
  }
  .diff-btn.active{
    background:#eef0ff;
    border-color:var(--primary);
    color:var(--primary-dark);
  }

  /* ---------- Puzzle screen ---------- */
  .stats-bar{
    width:100%;
    display:flex;
    justify-content:space-between;
    gap:8px;
    background:#f6f6fb;
    border-radius:14px;
    padding:12px 16px;
    font-size:13px;
    font-weight:600;
    color:var(--text);
  }
  .stat{
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:2px;
    flex:1;
  }
  .stat .val{font-size:17px;font-weight:800;color:var(--primary-dark);}
  .stat .lab{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.4px;}

  #board-outer{
    width:100%;
    max-width:440px;
    display:flex;
    justify-content:center;
  }
  #board{
    position:relative;
    width:100%;
    aspect-ratio:1/1;
    border-radius:14px;
    overflow:hidden;
    background:#e5e7eb;
    box-shadow:0 10px 28px rgba(0,0,0,.25);
    touch-action:none;
    user-select:none;
  }
  .tile{
    position:absolute;
    border:1px solid rgba(255,255,255,.35);
    background-repeat:no-repeat;
    box-sizing:border-box;
    transition:left .18s ease, top .18s ease, box-shadow .15s ease;
    will-change:transform,left,top;
    cursor:grab;
  }
  .tile.dragging{
    cursor:grabbing;
    z-index:50;
    transition:none;
    box-shadow:0 12px 26px rgba(0,0,0,.4);
    border:3px solid #fbbf24 !important;
  }
  .tile.correct{
    border:3px solid var(--accent) !important;
  }
  .tile .num{
    position:absolute;
    top:2px;left:2px;
    font-size:10px;
    background:rgba(0,0,0,.45);
    color:#fff;
    padding:1px 5px;
    border-radius:6px;
    pointer-events:none;
    opacity:.75;
  }

  /* ---------- Results overlay ---------- */
  #overlay{
    position:fixed;
    inset:0;
    background:rgba(20,15,40,.72);
    backdrop-filter:blur(4px);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:1000;
    padding:16px;
  }
  #overlay .card{
    max-width:420px;
    text-align:center;
  }
  #overlay h2{
    margin:0;
    font-size:24px;
    color:var(--primary-dark);
  }
  #overlay .emoji{font-size:44px;}
  .result-grid{
    display:grid;
    grid-template-columns:1fr 1fr 1fr;
    gap:10px;
    width:100%;
  }
  .result-item{
    background:#f6f6fb;
    border-radius:12px;
    padding:10px 6px;
  }
  .result-item .v{font-size:18px;font-weight:800;color:var(--primary-dark);}
  .result-item .k{font-size:11px;color:var(--muted);text-transform:uppercase;font-weight:700;}

  table.leaderboard{
    width:100%;
    border-collapse:collapse;
    font-size:12.5px;
  }
  table.leaderboard th,table.leaderboard td{
    padding:6px 4px;
    border-bottom:1px solid #eee;
    text-align:center;
  }
  table.leaderboard th{color:var(--muted);font-weight:700;}
  .lb-title{
    font-size:14px;
    font-weight:800;
    color:var(--text);
    margin:4px 0 0;
  }
  .footer-note{
    color:rgba(255,255,255,.7);
    font-size:12px;
    margin-top:22px;
    text-align:center;
  }
  @media (max-width:420px){
    .card{padding:16px;border-radius:14px;}
    .stat .val{font-size:15px;}
  }
</style>
</head>
<body>
<div id="app">
  <h1 class="title">🧩 Face Puzzle</h1>
  <p class="subtitle">Snap a selfie, scramble it, and put your face back together.</p>

  <!-- CAMERA SCREEN -->
  <div class="card" id="screen-camera">
    <div class="video-wrap">
      <video id="video" autoplay playsinline muted></video>
      <div class="face-guide"></div>
    </div>
    <div class="camera-status" id="cameraStatus">Requesting camera access…</div>
    <div class="btn-row">
      <button class="btn" id="btnTakePhoto" disabled>📸 Take Photo</button>
      <button class="btn secondary" id="btnRetryCamera" style="display:none;">🔁 Retry Camera</button>
    </div>
    <div class="upload-fallback" id="uploadFallback" style="display:none;">
      <span>Camera unavailable? Upload a photo instead:</span>
      <label for="fileInput">Choose Image</label>
      <input type="file" id="fileInput" accept="image/*" capture="user">
    </div>
  </div>

  <!-- PREVIEW / DIFFICULTY SCREEN -->
  <div class="card hidden" id="screen-preview">
    <div class="preview-img-wrap"><img id="previewImg" alt="Captured face"></div>
    <div>
      <p style="text-align:center;font-weight:700;margin:0 0 10px;">Choose difficulty</p>
      <div class="diff-row" id="diffRow">
        <button class="diff-btn active" data-size="3">3 × 3</button>
        <button class="diff-btn" data-size="4">4 × 4</button>
        <button class="diff-btn" data-size="5">5 × 5</button>
      </div>
    </div>
    <div class="btn-row">
      <button class="btn secondary" id="btnRetake">↩️ Retake Photo</button>
      <button class="btn success" id="btnStartPuzzle">▶️ Start Puzzle</button>
    </div>
  </div>

  <!-- PUZZLE SCREEN -->
  <div class="card hidden" id="screen-puzzle">
    <div class="stats-bar">
      <div class="stat"><span class="val" id="statTime">00:00.0</span><span class="lab">Time</span></div>
      <div class="stat"><span class="val" id="statMoves">0</span><span class="lab">Moves</span></div>
      <div class="stat"><span class="val" id="statCorrect">0 / 0</span><span class="lab">Correct</span></div>
    </div>
    <div id="board-outer"><div id="board"></div></div>
    <div class="btn-row">
      <button class="btn secondary" id="btnShuffleAgain">🔀 Reshuffle</button>
      <button class="btn secondary" id="btnNewPhotoFromPuzzle">🖼️ New Photo</button>
    </div>
  </div>

  <p class="footer-note">Your photo is processed locally in your browser and is never uploaded anywhere.</p>
</div>

<!-- RESULTS OVERLAY -->
<div id="overlay" class="hidden">
  <div class="card">
    <div class="emoji">🎉</div>
    <h2>Puzzle Solved!</h2>
    <div class="result-grid">
      <div class="result-item"><div class="v" id="resTime">--</div><div class="k">Time</div></div>
      <div class="result-item"><div class="v" id="resMoves">--</div><div class="k">Moves</div></div>
      <div class="result-item"><div class="v" id="resDiff">--</div><div class="k">Grid</div></div>
    </div>
    <p class="lb-title">🏆 Top 5 Best Times</p>
    <table class="leaderboard">
      <thead><tr><th>#</th><th>Time</th><th>Moves</th><th>Grid</th><th>Date</th></tr></thead>
      <tbody id="leaderboardBody"></tbody>
    </table>
    <div class="btn-row">
      <button class="btn success" id="btnPlayAgain">🔄 Play Again</button>
      <button class="btn secondary" id="btnNewPhotoFromResults">🖼️ New Photo</button>
    </div>
  </div>
</div>

<canvas id="captureCanvas" width="600" height="600" style="display:none;"></canvas>

<script>
(function(){
  'use strict';

  // ---------------- State ----------------
  let mediaStream = null;
  let capturedDataURL = null;
  let gridSize = 3;
  let pieces = [];           // {correctIndex, currentIndex, el}
  let moves = 0;
  let rafId = null;
  let startTime = 0;
  let finalElapsed = 0;
  let timerRunning = false;
  let dragCtx = null;

  const LB_KEY = 'facePuzzle_leaderboard_v1';

  // ---------------- Element refs ----------------
  const video = document.getElementById('video');
  const cameraStatus = document.getElementById('cameraStatus');
  const btnTakePhoto = document.getElementById('btnTakePhoto');
  const btnRetryCamera = document.getElementById('btnRetryCamera');
  const uploadFallback = document.getElementById('uploadFallback');
  const fileInput = document.getElementById('fileInput');
  const captureCanvas = document.getElementById('captureCanvas');

  const screenCamera = document.getElementById('screen-camera');
  const screenPreview = document.getElementById('screen-preview');
  const screenPuzzle = document.getElementById('screen-puzzle');
  const previewImg = document.getElementById('previewImg');
  const diffRow = document.getElementById('diffRow');
  const btnRetake = document.getElementById('btnRetake');
  const btnStartPuzzle = document.getElementById('btnStartPuzzle');

  const statTime = document.getElementById('statTime');
  const statMoves = document.getElementById('statMoves');
  const statCorrect = document.getElementById('statCorrect');
  const board = document.getElementById('board');
  const btnShuffleAgain = document.getElementById('btnShuffleAgain');
  const btnNewPhotoFromPuzzle = document.getElementById('btnNewPhotoFromPuzzle');

  const overlay = document.getElementById('overlay');
  const resTime = document.getElementById('resTime');
  const resMoves = document.getElementById('resMoves');
  const resDiff = document.getElementById('resDiff');
  const leaderboardBody = document.getElementById('leaderboardBody');
  const btnPlayAgain = document.getElementById('btnPlayAgain');
  const btnNewPhotoFromResults = document.getElementById('btnNewPhotoFromResults');

  // ---------------- Screen switching ----------------
  function showScreen(name){
    screenCamera.classList.toggle('hidden', name !== 'camera');
    screenPreview.classList.toggle('hidden', name !== 'preview');
    screenPuzzle.classList.toggle('hidden', name !== 'puzzle');
  }

  // ---------------- Camera handling ----------------
  async function initCamera(){
    cameraStatus.textContent = 'Requesting camera access…';
    btnTakePhoto.disabled = true;
    btnRetryCamera.style.display = 'none';
    uploadFallback.style.display = 'none';

    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      cameraStatus.textContent = 'Camera API not supported in this browser.';
      uploadFallback.style.display = 'flex';
      return;
    }

    try{
      const constraints = {
        video:{ facingMode:'user', width:{ideal:720}, height:{ideal:720} },
        audio:false
      };
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = mediaStream;
      await video.play().catch(()=>{});
      cameraStatus.textContent = 'Camera ready — center your face and take a photo.';
      btnTakePhoto.disabled = false;
    }catch(err){
      console.warn('Camera error:', err);
      if(err && err.name === 'NotAllowedError'){
        cameraStatus.textContent = 'Camera permission denied. You can allow it in your browser settings, or upload a photo instead.';
      }else if(err && err.name === 'NotFoundError'){
        cameraStatus.textContent = 'No camera device found. You can upload a photo instead.';
      }else{
        cameraStatus.textContent = 'Could not access camera. You can upload a photo instead.';
      }
      btnRetryCamera.style.display = 'inline-block';
      uploadFallback.style.display = 'flex';
    }
  }

  function stopCamera(){
    if(mediaStream){
      mediaStream.getTracks().forEach(t=>t.stop());
      mediaStream = null;
    }
  }

  function squareCropToCanvas(sourceEl, srcW, srcH, mirror){
    const size = Math.min(srcW, srcH);
    const sx = (srcW - size)/2;
    const sy = (srcH - size)/2;
    const ctx = captureCanvas.getContext('2d');
    captureCanvas.width = 600;
    captureCanvas.height = 600;
    ctx.save();
    ctx.clearRect(0,0,600,600);
    if(mirror){
      ctx.translate(600,0);
      ctx.scale(-1,1);
    }
    ctx.drawImage(sourceEl, sx, sy, size, size, 0, 0, 600, 600);
    ctx.restore();
    return captureCanvas.toDataURL('image/png');
  }

  btnTakePhoto.addEventListener('click', ()=>{
    if(!video.videoWidth || !video.videoHeight) return;
    capturedDataURL = squareCropToCanvas(video, video.videoWidth, video.videoHeight, true);
    previewImg.src = capturedDataURL;
    stopCamera();
    showScreen('preview');
  });

  btnRetryCamera.addEventListener('click', initCamera);

  fileInput.addEventListener('change', (e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const img = new Image();
    const reader = new FileReader();
    reader.onload = function(ev){
      img.onload = function(){
        capturedDataURL = squareCropToCanvas(img, img.naturalWidth, img.naturalHeight, false);
        previewImg.src = capturedDataURL;
        stopCamera();
        showScreen('preview');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  btnRetake.addEventListener('click', ()=>{
    showScreen('camera');
    initCamera();
  });

  // ---------------- Difficulty selection ----------------
  diffRow.addEventListener('click', (e)=>{
    const btn = e.target.closest('.diff-btn');
    if(!btn) return;
    diffRow.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    gridSize = parseInt(btn.dataset.size, 10);
  });

  btnStartPuzzle.addEventListener('click', ()=>{
    showScreen('puzzle');
    buildPuzzle();
  });

  // ---------------- Puzzle build ----------------
  function shuffledPositions(n){
    const arr = [];
    for(let i=0;i<n;i++) arr.push(i);
    let isIdentity = true;
    do{
      for(let i=arr.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]] = [arr[j],arr[i]];
      }
      isIdentity = arr.every((v,idx)=>v===idx);
    }while(isIdentity && n>1);
    return arr;
  }

  function buildPuzzle(){
    board.innerHTML = '';
    pieces = [];
    moves = 0;
    const total = gridSize*gridSize;
    const positions = shuffledPositions(total); // positions[correctIndex] = currentIndex

    for(let correctIndex=0; correctIndex<total; correctIndex++){
      const currentIndex = positions[correctIndex];
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.style.backgroundImage = `url(${capturedDataURL})`;
      tile.style.backgroundSize = `${gridSize*100}% ${gridSize*100}%`;

      const correctCol = correctIndex % gridSize;
      const correctRow = Math.floor(correctIndex / gridSize);
      const bpX = gridSize > 1 ? (correctCol/(gridSize-1))*100 : 0;
      const bpY = gridSize > 1 ? (correctRow/(gridSize-1))*100 : 0;
      tile.style.backgroundPosition = `${bpX}% ${bpY}%`;

      const numLabel = document.createElement('span');
      numLabel.className = 'num';
      numLabel.textContent = correctIndex+1;
      tile.appendChild(numLabel);

      const pieceObj = { correctIndex, currentIndex, el: tile };
      tile.dataset.correctIndex = correctIndex;
      pieces.push(pieceObj);

      attachDragHandlers(tile, pieceObj);
      board.appendChild(tile);
    }

    layoutAllTiles();
    updateCorrectClasses();
    updateStatsDisplay();
    startTimer();
  }

  function positionStyleFor(index){
    const col = index % gridSize;
    const row = Math.floor(index / gridSize);
    return {
      left: (col/gridSize*100)+'%',
      top: (row/gridSize*100)+'%',
      width: (100/gridSize)+'%',
      height: (100/gridSize)+'%'
    };
  }

  function layoutAllTiles(){
    pieces.forEach(p=>{
      const s = positionStyleFor(p.currentIndex);
      p.el.style.left = s.left;
      p.el.style.top = s.top;
      p.el.style.width = s.width;
      p.el.style.height = s.height;
    });
  }

  function updateCorrectClasses(){
    let correctCount = 0;
    pieces.forEach(p=>{
      const isCorrect = p.currentIndex === p.correctIndex;
      p.el.classList.toggle('correct', isCorrect);
      if(isCorrect) correctCount++;
    });
    statCorrect.textContent = `${correctCount} / ${pieces.length}`;
    return correctCount;
  }

  // ---------------- Timer ----------------
  function formatTime(ms){
    const totalSec = ms/1000;
    const mm = Math.floor(totalSec/60);
    const ss = Math.floor(totalSec%60);
    const t = Math.floor((ms%1000)/100);
    return `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}.${t}`;
  }

  function startTimer(){
    startTime = performance.now();
    timerRunning = true;
    cancelAnimationFrame(rafId);
    tick();
  }

  function tick(){
    if(!timerRunning) return;
    const elapsed = performance.now() - startTime;
    statTime.textContent = formatTime(elapsed);
    rafId = requestAnimationFrame(tick);
  }

  function stopTimer(){
    timerRunning = false;
    cancelAnimationFrame(rafId);
    finalElapsed = performance.now() - startTime;
    statTime.textContent = formatTime(finalElapsed);
  }

  function updateStatsDisplay(){
    statMoves.textContent = moves;
    updateCorrectClasses();
  }

  // ---------------- Drag & drop (pointer events) ----------------
  function attachDragHandlers(tile, pieceObj){
    tile.addEventListener('pointerdown', (e)=>onPointerDown(e, pieceObj));
  }

  function onPointerDown(e, pieceObj){
    e.preventDefault();
    const tile = pieceObj.el;
    tile.setPointerCapture(e.pointerId);

    const boardRect = board.getBoundingClientRect();
    const tileRect = tile.getBoundingClientRect();

    dragCtx = {
      pieceObj,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      tileStartLeftPx: tileRect.left - boardRect.left,
      tileStartTopPx: tileRect.top - boardRect.top,
      boardRect
    };

    tile.classList.add('dragging');
    tile.style.width = tileRect.width+'px';
    tile.style.height = tileRect.height+'px';
    tile.style.left = dragCtx.tileStartLeftPx+'px';
    tile.style.top = dragCtx.tileStartTopPx+'px';

    tile.addEventListener('pointermove', onPointerMove);
    tile.addEventListener('pointerup', onPointerUp);
    tile.addEventListener('pointercancel', onPointerCancel);
  }

  function onPointerMove(e){
    if(!dragCtx || e.pointerId !== dragCtx.pointerId) return;
    const dx = e.clientX - dragCtx.startClientX;
    const dy = e.clientY - dragCtx.startClientY;
    const tile = dragCtx.pieceObj.el;
    tile.style.left = (dragCtx.tileStartLeftPx + dx)+'px';
    tile.style.top = (dragCtx.tileStartTopPx + dy)+'px';
  }

  function onPointerUp(e){
    if(!dragCtx || e.pointerId !== dragCtx.pointerId) return;
    const { pieceObj, boardRect } = dragCtx;
    const tile = pieceObj.el;

    const cellSize = boardRect.width / gridSize;
    const dropX = e.clientX - boardRect.left;
    const dropY = e.clientY - boardRect.top;
    let col = Math.floor(dropX / cellSize);
    let row = Math.floor(dropY / cellSize);
    col = Math.max(0, Math.min(gridSize-1, col));
    row = Math.max(0, Math.min(gridSize-1, row));
    const targetIndex = row*gridSize + col;

    finishDrag(tile);

    if(targetIndex !== pieceObj.currentIndex){
      const targetPiece = pieces.find(p=>p.currentIndex === targetIndex);
      const originalIndex = pieceObj.currentIndex;
      pieceObj.currentIndex = targetIndex;
      if(targetPiece) targetPiece.currentIndex = originalIndex;

      moves++;
      layoutAllTiles();
      updateStatsDisplay();

      const correctCount = updateCorrectClasses();
      if(correctCount === pieces.length){
        handleWin();
      }
    }else{
      layoutAllTiles();
    }

    dragCtx = null;
  }

  function onPointerCancel(e){
    if(!dragCtx || e.pointerId !== dragCtx.pointerId) return;
    finishDrag(dragCtx.pieceObj.el);
    layoutAllTiles();
    dragCtx = null;
  }

  function finishDrag(tile){
    tile.classList.remove('dragging');
    tile.style.width = '';
    tile.style.height = '';
    tile.removeEventListener('pointermove', onPointerMove);
    tile.removeEventListener('pointerup', onPointerUp);
    tile.removeEventListener('pointercancel', onPointerCancel);
  }

  // ---------------- Win / results ----------------
  function handleWin(){
    stopTimer();
    resTime.textContent = formatTime(finalElapsed);
    resMoves.textContent = moves;
    resDiff.textContent = `${gridSize} × ${gridSize}`;

    saveScore({
      time: finalElapsed,
      timeLabel: formatTime(finalElapsed),
      moves,
      difficulty: `${gridSize}x${gridSize}`,
      date: new Date().toLocaleDateString()
    });
    renderLeaderboard();
    overlay.classList.remove('hidden');
  }

  function loadLeaderboard(){
    try{
      const raw = localStorage.getItem(LB_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      return [];
    }
  }

  function saveScore(record){
    let list = loadLeaderboard();
    list.push(record);
    list.sort((a,b)=>a.time-b.time);
    list = list.slice(0,5);
    try{
      localStorage.setItem(LB_KEY, JSON.stringify(list));
    }catch(e){ /* storage unavailable, ignore */ }
  }

  function renderLeaderboard(){
    const list = loadLeaderboard();
    leaderboardBody.innerHTML = '';
    if(list.length === 0){
      leaderboardBody.innerHTML = '<tr><td colspan="5">No scores yet — be the first!</td></tr>';
      return;
    }
    list.forEach((rec, idx)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${idx+1}</td><td>${rec.timeLabel}</td><td>${rec.moves}</td><td>${rec.difficulty}</td><td>${rec.date}</td>`;
      leaderboardBody.appendChild(tr);
    });
  }

  // ---------------- Buttons: reshuffle / new photo / play again ----------------
  btnShuffleAgain.addEventListener('click', ()=>{
    buildPuzzle();
  });

  btnNewPhotoFromPuzzle.addEventListener('click', goToNewPhoto);
  btnNewPhotoFromResults.addEventListener('click', ()=>{
    overlay.classList.add('hidden');
    goToNewPhoto();
  });

  function goToNewPhoto(){
    timerRunning = false;
    cancelAnimationFrame(rafId);
    showScreen('camera');
    initCamera();
  }

  btnPlayAgain.addEventListener('click', ()=>{
    overlay.classList.add('hidden');
    showScreen('puzzle');
    buildPuzzle();
  });

  // ---------------- Responsive re-layout on resize ----------------
  window.addEventListener('resize', ()=>{
    if(pieces.length) layoutAllTiles();
  });

  // ---------------- Init ----------------
  initCamera();
  renderLeaderboard();

})();
</script>
</body>
</html>
