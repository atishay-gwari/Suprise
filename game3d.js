// Leps' Chronicles of WonderCore - 3D Edition
// A Valentine's Day Adventure Game

let scene, camera, renderer, player;
let clock = new THREE.Clock();

// Game state
const gameState = {
    currentScene: 1,
    hasScarf: false,
    gameEnded: false,
    dialogueActive: false,
    currentNPC: null,
    isJumping: false,
    velocityY: 0,
    onGround: true,
    calledTsushi: false,
    tsushiCarrying: false
};

// Physics
const gravity = -0.015;
const jumpForce = 0.25;

// Input
const keys = {};
const playerVelocity = new THREE.Vector3();
const playerSpeed = 0.15;

// Scene objects
let sceneObjects = { lights: [], objects: [], npcs: [], platforms: [] };
let snowParticles, magicParticles;
let tsushiDog = null;

// Initialize
function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('game-container').insertBefore(renderer.domElement, document.getElementById('ui-overlay'));
    
    createPlayer();
    loadScene1();
    setupControls();
    window.addEventListener('resize', onWindowResize);
    
    animate();
}

function createPlayer() {
    player = new THREE.Group();
    
    // Body (black sphere)
    const bodyGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.5;
    body.castShadow = true;
    player.add(body);
    
    // Head
    const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.1, 0.1);
    head.castShadow = true;
    player.add(head);
    
    // Ears
    const earGeo = new THREE.ConeGeometry(0.12, 0.25, 4);
    const earMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.2, 1.4, 0);
    leftEar.rotation.z = 0.3;
    player.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.2, 1.4, 0);
    rightEar.rotation.z = -0.3;
    player.add(rightEar);
    
    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.12, 1.15, 0.3);
    player.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.12, 1.15, 0.3);
    player.add(rightEye);
    
    // Pupils
    const pupilGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.12, 1.15, 0.36);
    player.add(leftPupil);
    
    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.12, 1.15, 0.36);
    player.add(rightPupil);
    
    // Nose
    const noseGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xe91e63 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 1.05, 0.35);
    player.add(nose);
    
    // Tail
    const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.5, -0.4),
        new THREE.Vector3(0, 0.8, -0.7),
        new THREE.Vector3(0, 1.1, -0.6)
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 10, 0.08, 8, false);
    const tailMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.name = 'tail';
    player.add(tail);
    
    player.position.set(0, 0, 5);
    scene.add(player);
}


// Scene 1: The Lantern Waste with Jumping Platforms
function loadScene1() {
    clearScene();
    document.getElementById('scene-title').textContent = 'The Lantern Waste';
    document.getElementById('controls-hint').textContent = 'WASD: Move | SPACE: Jump | E: Interact';
    
    scene.background = new THREE.Color(0x1a237e);
    scene.fog = new THREE.Fog(0x1a237e, 10, 50);
    
    const ambient = new THREE.AmbientLight(0x4466aa, 0.4);
    scene.add(ambient);
    sceneObjects.lights.push(ambient);
    
    const moonLight = new THREE.DirectionalLight(0x8899cc, 0.5);
    moonLight.position.set(10, 20, 10);
    moonLight.castShadow = true;
    scene.add(moonLight);
    sceneObjects.lights.push(moonLight);
    
    // Starting ground area
    const startGround = createPlatform(0, -0.1, 3, 8, 0.2, 8, 0xe8eaf6);
    
    // Snowy ground (lower, with gap)
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x3949ab, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    scene.add(ground);
    sceneObjects.objects.push(ground);
    
    // Create wardrobe
    createWardrobe(-6, 0, 2);
    
    // Create chest with scarf on starting platform
    createChest(3, 0, 2);
    
    // JUMPING PLATFORMS TO KNIGHT
    // Platform 1
    createPlatform(0, 0.5, -2, 2, 0.5, 2, 0xc5cae9);
    // Platform 2 (higher)
    createPlatform(3, 1.5, -4, 2, 0.5, 2, 0xb3e5fc);
    // Platform 3
    createPlatform(0, 2.5, -6, 2, 0.5, 2, 0xc5cae9);
    // Platform 4 (higher)
    createPlatform(4, 3.5, -8, 2, 0.5, 2, 0xb3e5fc);
    // Platform 5 - Knight's platform
    createPlatform(8, 4, -8, 4, 0.5, 4, 0xe8eaf6);
    
    // Create lamp posts
    createLampPost(-4, 0, 0);
    createLampPost(2, 0, 5);
    
    // Create snowy trees
    for (let i = 0; i < 10; i++) {
        const x = (Math.random() - 0.5) * 30;
        const z = (Math.random() - 0.5) * 30;
        if (Math.abs(x) > 5 || z > 0) {
            createSnowyTree(x, -5, z);
        }
    }
    
    // Create Knight on elevated platform
    createKnight(8, 4.5, -8);
    
    createSnowParticles();
    
    player.position.set(0, 1, 5);
    gameState.onGround = true;
}

function createPlatform(x, y, z, width, height, depth, color) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshStandardMaterial({ color: color });
    const platform = new THREE.Mesh(geo, mat);
    platform.position.set(x, y, z);
    platform.receiveShadow = true;
    platform.castShadow = true;
    platform.userData = { 
        type: 'platform',
        top: y + height / 2,
        minX: x - width / 2,
        maxX: x + width / 2,
        minZ: z - depth / 2,
        maxZ: z + depth / 2
    };
    scene.add(platform);
    sceneObjects.platforms.push(platform);
    return platform;
}

function createWardrobe(x, y, z) {
    const wardrobe = new THREE.Group();
    
    const bodyGeo = new THREE.BoxGeometry(2, 3, 1);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.5;
    body.castShadow = true;
    wardrobe.add(body);
    
    const doorGeo = new THREE.BoxGeometry(0.9, 2.5, 0.1);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41 });
    const leftDoor = new THREE.Mesh(doorGeo, doorMat);
    leftDoor.position.set(-0.45, 1.5, 0.5);
    wardrobe.add(leftDoor);
    
    const rightDoor = new THREE.Mesh(doorGeo, doorMat);
    rightDoor.position.set(0.45, 1.5, 0.5);
    wardrobe.add(rightDoor);
    
    const handleGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const leftHandle = new THREE.Mesh(handleGeo, handleMat);
    leftHandle.position.set(-0.2, 1.5, 0.6);
    wardrobe.add(leftHandle);
    
    const rightHandle = new THREE.Mesh(handleGeo, handleMat);
    rightHandle.position.set(0.2, 1.5, 0.6);
    wardrobe.add(rightHandle);
    
    const snowGeo = new THREE.BoxGeometry(2.2, 0.2, 1.2);
    const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const snow = new THREE.Mesh(snowGeo, snowMat);
    snow.position.y = 3.1;
    wardrobe.add(snow);
    
    wardrobe.position.set(x, y, z);
    scene.add(wardrobe);
    sceneObjects.objects.push(wardrobe);
}

function createLampPost(x, y, z) {
    const lamp = new THREE.Group();
    
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 4, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x37474f });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 2;
    lamp.add(pole);
    
    const housingGeo = new THREE.BoxGeometry(0.5, 0.6, 0.5);
    const housingMat = new THREE.MeshStandardMaterial({ color: 0x263238 });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.y = 4.2;
    lamp.add(housing);
    
    const bulbGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff3e0, emissive: 0xffcc80, emissiveIntensity: 1 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = 4;
    lamp.add(bulb);
    
    const light = new THREE.PointLight(0xffcc80, 1, 8);
    light.position.y = 4;
    lamp.add(light);
    
    lamp.position.set(x, y, z);
    scene.add(lamp);
    sceneObjects.objects.push(lamp);
}

function createSnowyTree(x, y, z) {
    const tree = new THREE.Group();
    
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1;
    tree.add(trunk);
    
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    const layer1 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2, 8), foliageMat);
    layer1.position.y = 3;
    tree.add(layer1);
    
    const layer2 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.5, 8), foliageMat);
    layer2.position.y = 4.2;
    tree.add(layer2);
    
    tree.position.set(x, y, z);
    scene.add(tree);
    sceneObjects.objects.push(tree);
}


function createChest(x, y, z) {
    const chest = new THREE.Group();
    chest.userData = { type: 'chest', hasScarf: true };
    
    const bodyGeo = new THREE.BoxGeometry(1, 0.6, 0.6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.3;
    chest.add(body);
    
    const lidGeo = new THREE.BoxGeometry(1.05, 0.2, 0.65);
    const lidMat = new THREE.MeshStandardMaterial({ color: 0xa1887f });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.y = 0.7;
    chest.add(lid);
    
    const lockGeo = new THREE.BoxGeometry(0.15, 0.15, 0.1);
    const lockMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const lock = new THREE.Mesh(lockGeo, lockMat);
    lock.position.set(0, 0.5, 0.35);
    chest.add(lock);
    
    const scarfGeo = new THREE.BoxGeometry(0.6, 0.1, 0.3);
    const scarfMat = new THREE.MeshStandardMaterial({ color: 0x1565c0 });
    const scarf = new THREE.Mesh(scarfGeo, scarfMat);
    scarf.position.y = 0.4;
    scarf.visible = false;
    scarf.name = 'scarf';
    chest.add(scarf);
    
    chest.position.set(x, y, z);
    scene.add(chest);
    sceneObjects.npcs.push(chest);
}

function createKnight(x, y, z) {
    const knight = new THREE.Group();
    knight.userData = { type: 'knight' };
    
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.5, 1.2, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x034694 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1;
    knight.add(body);
    
    const helmetGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x546e7a });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 1.9;
    knight.add(helmet);
    
    const visorGeo = new THREE.BoxGeometry(0.5, 0.15, 0.3);
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x263238 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.85, 0.25);
    knight.add(visor);
    
    const plumeGeo = new THREE.ConeGeometry(0.15, 0.5, 8);
    const plumeMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.position.set(0, 2.4, 0);
    knight.add(plume);
    
    const shieldGeo = new THREE.BoxGeometry(0.5, 0.8, 0.1);
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0x034694 });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.set(-0.6, 1, 0.2);
    knight.add(shield);
    
    const emblemGeo = new THREE.CircleGeometry(0.15, 16);
    const emblemMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.position.set(-0.6, 1, 0.26);
    knight.add(emblem);
    
    const swordGeo = new THREE.BoxGeometry(0.08, 1.2, 0.02);
    const swordMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae });
    const sword = new THREE.Mesh(swordGeo, swordMat);
    sword.position.set(0.6, 1, 0);
    knight.add(sword);
    
    const legGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.6, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x455a64 });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.2, 0.3, 0);
    knight.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.2, 0.3, 0);
    knight.add(rightLeg);
    
    knight.position.set(x, y, z);
    scene.add(knight);
    sceneObjects.npcs.push(knight);
}

function createSnowParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 60;
        positions[i + 1] = Math.random() * 20;
        positions[i + 2] = (Math.random() - 0.5) * 60;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8 });
    snowParticles = new THREE.Points(geometry, material);
    scene.add(snowParticles);
    sceneObjects.objects.push(snowParticles);
}


// Scene 2: The Garden of Hearts - DIFFICULT with Tsushi rescue!
function loadScene2() {
    clearScene();
    document.getElementById('scene-title').textContent = 'The Garden of Hearts';
    document.getElementById('controls-hint').textContent = 'WASD: Move | SPACE: Jump | E: Interact | Type "Tsushi" for help!';
    
    gameState.calledTsushi = false;
    gameState.tsushiCarrying = false;
    tsushiDog = null;
    
    scene.background = new THREE.Color(0x4a148c);
    scene.fog = new THREE.Fog(0x4a148c, 15, 60);
    
    const ambient = new THREE.AmbientLight(0x9966ff, 0.5);
    scene.add(ambient);
    sceneObjects.lights.push(ambient);
    
    const magicLight = new THREE.DirectionalLight(0xff66ff, 0.6);
    magicLight.position.set(-5, 15, 5);
    magicLight.castShadow = true;
    scene.add(magicLight);
    sceneObjects.lights.push(magicLight);
    
    // Dangerous void below
    const voidGeo = new THREE.PlaneGeometry(100, 100);
    const voidMat = new THREE.MeshStandardMaterial({ color: 0x1a0033 });
    const voidFloor = new THREE.Mesh(voidGeo, voidMat);
    voidFloor.rotation.x = -Math.PI / 2;
    voidFloor.position.y = -10;
    scene.add(voidFloor);
    sceneObjects.objects.push(voidFloor);
    
    // Starting platform
    createPlatform(0, 0, 5, 5, 0.5, 5, 0x00c853);
    
    // DIFFICULT PLATFORMING SECTION
    // Tiny platforms, big gaps!
    createPlatform(-3, 1, 2, 1.5, 0.3, 1.5, 0xff1493);
    createPlatform(2, 2, 0, 1.2, 0.3, 1.2, 0x00bcd4);
    createPlatform(-2, 3, -3, 1, 0.3, 1, 0xffeb3b);
    createPlatform(3, 4, -5, 1, 0.3, 1, 0x9c27b0);
    createPlatform(-1, 5, -7, 0.8, 0.3, 0.8, 0xff5722);
    createPlatform(4, 6, -9, 0.8, 0.3, 0.8, 0x00bcd4);
    createPlatform(0, 7, -11, 0.8, 0.3, 0.8, 0xff1493);
    createPlatform(-4, 8, -13, 0.8, 0.3, 0.8, 0xffeb3b);
    
    // Cheshire Cat's platform (very high!)
    createPlatform(0, 9, -16, 4, 0.5, 4, 0x9c27b0);
    
    // Giant mushrooms (decoration)
    createMushroom(-8, -10, -4, 2, 0xff1493);
    createMushroom(10, -10, -8, 1.5, 0x00bcd4);
    createMushroom(-6, -10, 8, 1.8, 0xffeb3b);
    
    // Giant roses
    createGiantRose(6, -10, -2);
    createGiantRose(-5, -10, -10);
    
    // Cheshire Cat on high platform
    createCheshireCat(0, 10, -16);
    
    // Help sign
    createHelpSign(2, 0.5, 5);
    
    createMagicParticles();
    
    player.position.set(0, 1, 5);
    gameState.onGround = true;
}

function createHelpSign(x, y, z) {
    const sign = new THREE.Group();
    
    const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = 1;
    sign.add(post);
    
    const boardGeo = new THREE.BoxGeometry(1.5, 0.8, 0.1);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = 2.2;
    sign.add(board);
    
    // Add "?" text indicator
    const questionGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const questionMat = new THREE.MeshStandardMaterial({ color: 0xff4081, emissive: 0xff4081, emissiveIntensity: 0.5 });
    const question = new THREE.Mesh(questionGeo, questionMat);
    question.position.y = 2.8;
    sign.add(question);
    
    sign.userData = { type: 'helpSign' };
    sign.position.set(x, y, z);
    scene.add(sign);
    sceneObjects.npcs.push(sign);
}

function createTsushiDog() {
    const dog = new THREE.Group();
    dog.userData = { type: 'tsushi' };
    
    // Body (golden/cream colored cute dog)
    const bodyGeo = new THREE.SphereGeometry(0.8, 16, 16);
    bodyGeo.scale(1.3, 0.9, 1);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.8;
    body.castShadow = true;
    dog.add(body);
    
    // Head
    const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xf4d03f });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.4, 0.5);
    head.castShadow = true;
    dog.add(head);
    
    // Snout
    const snoutGeo = new THREE.SphereGeometry(0.25, 12, 12);
    snoutGeo.scale(1, 0.7, 1.2);
    const snoutMat = new THREE.MeshStandardMaterial({ color: 0xf5e6ab });
    const snout = new THREE.Mesh(snoutGeo, snoutMat);
    snout.position.set(0, 1.25, 0.85);
    dog.add(snout);
    
    // Nose
    const noseGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 1.3, 1.05);
    dog.add(nose);
    
    // Eyes (happy!)
    const eyeGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.18, 1.5, 0.85);
    dog.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.18, 1.5, 0.85);
    dog.add(rightEye);
    
    // Floppy ears
    const earGeo = new THREE.SphereGeometry(0.2, 8, 8);
    earGeo.scale(0.6, 1.2, 0.4);
    const earMat = new THREE.MeshStandardMaterial({ color: 0xc9922e });
    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.4, 1.5, 0.3);
    leftEar.rotation.z = 0.5;
    dog.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.4, 1.5, 0.3);
    rightEar.rotation.z = -0.5;
    dog.add(rightEar);
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.6, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
    
    const fl = new THREE.Mesh(legGeo, legMat);
    fl.position.set(-0.35, 0.3, 0.4);
    dog.add(fl);
    
    const fr = new THREE.Mesh(legGeo, legMat);
    fr.position.set(0.35, 0.3, 0.4);
    dog.add(fr);
    
    const bl = new THREE.Mesh(legGeo, legMat);
    bl.position.set(-0.35, 0.3, -0.3);
    dog.add(bl);
    
    const br = new THREE.Mesh(legGeo, legMat);
    br.position.set(0.35, 0.3, -0.3);
    dog.add(br);
    
    // Wagging tail
    const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.8, -0.7),
        new THREE.Vector3(0, 1.2, -1),
        new THREE.Vector3(0, 1.5, -0.9)
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 10, 0.08, 8, false);
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.name = 'dogTail';
    dog.add(tail);
    
    // Wings! (magical flying dog)
    const wingGeo = new THREE.SphereGeometry(0.5, 8, 8);
    wingGeo.scale(1.5, 0.3, 1);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-1, 1, 0);
    leftWing.name = 'leftWing';
    dog.add(leftWing);
    
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(1, 1, 0);
    rightWing.name = 'rightWing';
    dog.add(rightWing);
    
    // Sparkle effect around dog
    const sparkleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const sparkleMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 1 });
    for (let i = 0; i < 8; i++) {
        const sparkle = new THREE.Mesh(sparkleGeo, sparkleMat);
        const angle = (i / 8) * Math.PI * 2;
        sparkle.position.set(Math.cos(angle) * 1.5, 1 + Math.sin(angle * 2) * 0.3, Math.sin(angle) * 1.5);
        sparkle.userData = { angle: angle };
        sparkle.name = 'sparkle';
        dog.add(sparkle);
    }
    
    return dog;
}

function summonTsushi() {
    if (gameState.calledTsushi) return;
    
    gameState.calledTsushi = true;
    
    showDialogue("🐕 Tsushi heard your call! A magical golden dog appears with wings of light!");
    
    setTimeout(() => {
        hideDialogue();
        
        // Create Tsushi at player position
        tsushiDog = createTsushiDog();
        tsushiDog.position.copy(player.position);
        tsushiDog.position.y += 0.5;
        tsushiDog.position.x -= 2;
        scene.add(tsushiDog);
        
        // Start carrying animation
        setTimeout(() => {
            gameState.tsushiCarrying = true;
            showDialogue("Tsushi: 'Hop on, little lion! I'll take you to the Cheshire Cat!' 🐕✨");
            setTimeout(() => hideDialogue(), 2000);
        }, 1000);
    }, 2000);
}


function createMushroom(x, y, z, scale, color) {
    const mushroom = new THREE.Group();
    
    const stemGeo = new THREE.CylinderGeometry(0.3 * scale, 0.4 * scale, 2 * scale, 12);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = scale;
    mushroom.add(stem);
    
    const capGeo = new THREE.SphereGeometry(1 * scale, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const capMat = new THREE.MeshStandardMaterial({ color: color });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 2 * scale;
    mushroom.add(cap);
    
    const spotGeo = new THREE.CircleGeometry(0.15 * scale, 8);
    const spotMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    for (let i = 0; i < 5; i++) {
        const spot = new THREE.Mesh(spotGeo, spotMat);
        const angle = (i / 5) * Math.PI * 2;
        spot.position.set(Math.cos(angle) * 0.6 * scale, 2.3 * scale, Math.sin(angle) * 0.6 * scale);
        spot.lookAt(new THREE.Vector3(0, 2 * scale, 0));
        mushroom.add(spot);
    }
    
    mushroom.position.set(x, y, z);
    scene.add(mushroom);
    sceneObjects.objects.push(mushroom);
}

function createGiantRose(x, y, z) {
    const rose = new THREE.Group();
    
    const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.2, 1.5, 0),
        new THREE.Vector3(0, 3, 0)
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.1, 8, false);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    rose.add(stem);
    
    const petalGeo = new THREE.SphereGeometry(0.5, 8, 8);
    petalGeo.scale(1, 0.3, 1.5);
    const petalColors = [0xe91e63, 0xf06292, 0xf48fb1, 0xc2185b];
    
    for (let i = 0; i < 8; i++) {
        const petalMat = new THREE.MeshStandardMaterial({ color: petalColors[i % petalColors.length] });
        const petal = new THREE.Mesh(petalGeo, petalMat);
        const angle = (i / 8) * Math.PI * 2;
        petal.position.set(Math.cos(angle) * 0.4, 3.2, Math.sin(angle) * 0.4);
        petal.rotation.y = angle;
        rose.add(petal);
    }
    
    const centerGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const centerMat = new THREE.MeshStandardMaterial({ color: 0x880e4f });
    const center = new THREE.Mesh(centerGeo, centerMat);
    center.position.y = 3.2;
    rose.add(center);
    
    rose.position.set(x, y, z);
    scene.add(rose);
    sceneObjects.objects.push(rose);
}

function createCheshireCat(x, y, z) {
    const cat = new THREE.Group();
    cat.userData = { type: 'cheshire' };
    
    const bodyGeo = new THREE.SphereGeometry(0.8, 16, 16);
    bodyGeo.scale(1.3, 0.8, 1);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x7b1fa2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    cat.add(body);
    
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x4a148c });
    for (let i = 0; i < 4; i++) {
        const stripeGeo = new THREE.BoxGeometry(0.1, 0.5, 1.2);
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.x = -0.6 + i * 0.4;
        cat.add(stripe);
    }
    
    const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x9c27b0 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 0.6, 0.5);
    cat.add(head);
    
    const earGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
    const earMat = new THREE.MeshStandardMaterial({ color: 0x7b1fa2 });
    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.3, 1.1, 0.5);
    leftEar.rotation.z = 0.3;
    cat.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.3, 1.1, 0.5);
    rightEar.rotation.z = -0.3;
    cat.add(rightEar);
    
    const eyeGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b, emissive: 0xffeb3b, emissiveIntensity: 0.3 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.15, 0.7, 0.9);
    cat.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.15, 0.7, 0.9);
    cat.add(rightEye);
    
    const grinGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI);
    const grinMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const grin = new THREE.Mesh(grinGeo, grinMat);
    grin.position.set(0, 0.45, 0.85);
    grin.rotation.x = Math.PI;
    cat.add(grin);
    
    cat.position.set(x, y, z);
    cat.userData.baseY = y;
    scene.add(cat);
    sceneObjects.npcs.push(cat);
}

function createMagicParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 40;
        positions[i + 1] = Math.random() * 15;
        positions[i + 2] = (Math.random() - 0.5) * 40;
        colors[i] = 0.6 + Math.random() * 0.4;
        colors[i + 1] = Math.random() * 0.5;
        colors[i + 2] = 0.8 + Math.random() * 0.2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8 });
    magicParticles = new THREE.Points(geometry, material);
    scene.add(magicParticles);
    sceneObjects.objects.push(magicParticles);
}


// Scene 3: The Grand Finale
function loadScene3() {
    clearScene();
    document.getElementById('scene-title').textContent = 'The Grand Finale';
    document.getElementById('controls-hint').textContent = 'WASD: Move | E: Interact';
    
    gameState.calledTsushi = false;
    gameState.tsushiCarrying = false;
    tsushiDog = null;
    
    scene.background = new THREE.Color(0xc44569);
    scene.fog = new THREE.Fog(0xc44569, 10, 50);
    
    const ambient = new THREE.AmbientLight(0xff6b9d, 0.6);
    scene.add(ambient);
    sceneObjects.lights.push(ambient);
    
    const spotlight = new THREE.SpotLight(0xffffff, 1);
    spotlight.position.set(0, 15, 5);
    spotlight.target.position.set(0, 0, -5);
    spotlight.castShadow = true;
    scene.add(spotlight);
    scene.add(spotlight.target);
    sceneObjects.lights.push(spotlight);
    
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x6a1b4d, roughness: 0.7 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    sceneObjects.objects.push(ground);
    
    createHeartWardrobe(0, 0, -5);
    createStars();
    createFloatingHearts();
    
    player.position.set(0, 1, 5);
    gameState.onGround = true;
}

function createHeartWardrobe(x, y, z) {
    const wardrobe = new THREE.Group();
    wardrobe.userData = { type: 'heartWardrobe' };
    
    const heartMat = new THREE.MeshStandardMaterial({ color: 0xe91e63, emissive: 0xff4081, emissiveIntensity: 0.3 });
    
    const leftLobe = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), heartMat);
    leftLobe.position.set(-0.8, 3, 0);
    wardrobe.add(leftLobe);
    
    const rightLobe = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), heartMat);
    rightLobe.position.set(0.8, 3, 0);
    wardrobe.add(rightLobe);
    
    const bottomGeo = new THREE.ConeGeometry(1.8, 3, 32);
    const bottom = new THREE.Mesh(bottomGeo, heartMat);
    bottom.position.y = 0.8;
    bottom.rotation.x = Math.PI;
    wardrobe.add(bottom);
    
    const doorLineGeo = new THREE.BoxGeometry(0.05, 3.5, 0.1);
    const doorLineMat = new THREE.MeshStandardMaterial({ color: 0xc2185b });
    const doorLine = new THREE.Mesh(doorLineGeo, doorLineMat);
    doorLine.position.set(0, 2, 0.8);
    wardrobe.add(doorLine);
    
    const handleGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.5 });
    const leftHandle = new THREE.Mesh(handleGeo, handleMat);
    leftHandle.position.set(-0.3, 2, 0.9);
    wardrobe.add(leftHandle);
    
    const rightHandle = new THREE.Mesh(handleGeo, handleMat);
    rightHandle.position.set(0.3, 2, 0.9);
    wardrobe.add(rightHandle);
    
    const glow = new THREE.PointLight(0xff4081, 2, 10);
    glow.position.set(0, 2, 1);
    wardrobe.add(glow);
    
    for (let i = 0; i < 12; i++) {
        const sparkleGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const sparkleMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 1 });
        const sparkle = new THREE.Mesh(sparkleGeo, sparkleMat);
        const angle = (i / 12) * Math.PI * 2;
        sparkle.position.set(Math.cos(angle) * 2.5, 2 + Math.sin(angle * 2) * 0.5, Math.sin(angle) * 2.5);
        sparkle.userData = { angle: angle, baseY: sparkle.position.y };
        sparkle.name = 'sparkle';
        wardrobe.add(sparkle);
    }
    
    wardrobe.position.set(x, y, z);
    scene.add(wardrobe);
    sceneObjects.npcs.push(wardrobe);
}

function createStars() {
    const starCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = 10 + Math.random() * 30;
        positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.9 });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    sceneObjects.objects.push(stars);
}

function createFloatingHearts() {
    for (let i = 0; i < 10; i++) {
        const heart = new THREE.Group();
        const heartMat = new THREE.MeshStandardMaterial({ color: 0xff69b4, transparent: true, opacity: 0.7 });
        
        const leftLobe = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), heartMat);
        leftLobe.position.set(-0.12, 0.1, 0);
        heart.add(leftLobe);
        
        const rightLobe = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), heartMat);
        rightLobe.position.set(0.12, 0.1, 0);
        heart.add(rightLobe);
        
        const bottom = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.4, 16), heartMat);
        bottom.rotation.x = Math.PI;
        bottom.position.y = -0.15;
        heart.add(bottom);
        
        heart.position.set((Math.random() - 0.5) * 30, 2 + Math.random() * 8, (Math.random() - 0.5) * 30);
        heart.userData = { baseY: heart.position.y, speed: 0.5 + Math.random() * 0.5, offset: Math.random() * Math.PI * 2 };
        heart.name = 'floatingHeart';
        
        scene.add(heart);
        sceneObjects.objects.push(heart);
    }
}

function clearScene() {
    sceneObjects.lights.forEach(obj => scene.remove(obj));
    sceneObjects.objects.forEach(obj => scene.remove(obj));
    sceneObjects.npcs.forEach(obj => scene.remove(obj));
    sceneObjects.platforms.forEach(obj => scene.remove(obj));
    
    if (tsushiDog) {
        scene.remove(tsushiDog);
        tsushiDog = null;
    }
    
    sceneObjects = { lights: [], objects: [], npcs: [], platforms: [] };
    snowParticles = null;
    magicParticles = null;
}


// Controls and Input
function setupControls() {
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        
        // Jump with space (not while Tsushi is carrying!)
        if (e.key === ' ' && gameState.onGround && !gameState.dialogueActive && !gameState.tsushiCarrying) {
            gameState.velocityY = jumpForce;
            gameState.onGround = false;
            gameState.isJumping = true;
        }
        
        // Prevent default space scrolling
        if (e.key === ' ') {
            e.preventDefault();
        }
        
        // Interact with E
        if (e.key.toLowerCase() === 'e' && !gameState.dialogueActive) {
            checkInteraction();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // Dialogue button
    document.getElementById('dialogue-btn').addEventListener('click', handleDialogueResponse);
    document.getElementById('dialogue-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleDialogueResponse();
    });
}

function showDialogue(text, needsInput = false) {
    gameState.dialogueActive = true;
    const box = document.getElementById('dialogue-box');
    const input = document.getElementById('dialogue-input');
    
    box.style.display = 'block';
    document.getElementById('dialogue-text').textContent = text;
    
    if (needsInput) {
        input.style.display = 'block';
        input.value = '';
        input.focus();
    } else {
        input.style.display = 'none';
    }
}

function hideDialogue() {
    gameState.dialogueActive = false;
    document.getElementById('dialogue-box').style.display = 'none';
    document.getElementById('dialogue-input').style.display = 'none';
    gameState.currentNPC = null;
}

function handleDialogueResponse() {
    const input = document.getElementById('dialogue-input');
    const answer = input.value.trim().toLowerCase();
    
    // Check for Tsushi call in Scene 2!
    if (gameState.currentScene === 2 && (answer === 'tsushi' || answer === 'tsushi!')) {
        hideDialogue();
        summonTsushi();
        return;
    }
    
    if (gameState.currentNPC === 'knight') {
        if (answer === 'didier drogba' || answer === 'drogba') {
            showDialogue("The Knight nods solemnly: 'A true Blue indeed! The path to Wonderland opens before you, brave traveler!'");
            setTimeout(() => {
                hideDialogue();
                transitionToScene(2);
            }, 3000);
        } else if (answer) {
            showDialogue("The Knight shakes his head: 'That is not the answer I seek. Who is the King of Stamford Bridge?'", true);
        } else {
            hideDialogue();
        }
    } else if (gameState.currentNPC === 'cheshire') {
        if (answer === 'scorpions' || answer === 'scorpion' || answer === 'the scorpions') {
            showDialogue("The Cheshire Cat's grin widens: 'Yesss... the winds of change blow through your heart! The final door awaits...'");
            setTimeout(() => {
                hideDialogue();
                transitionToScene(3);
            }, 3000);
        } else if (answer) {
            showDialogue("The Cat's smile flickers: 'Hmm, that melody doesn't ring true... What band makes her heart sing?'", true);
        } else {
            hideDialogue();
        }
    } else if (gameState.currentNPC === 'helpSign') {
        // Help sign - can type Tsushi here!
        if (answer === 'tsushi' || answer === 'tsushi!') {
            hideDialogue();
            summonTsushi();
        } else {
            showDialogue("The sign glows mysteriously... Perhaps calling someone's name might help? 🐕", true);
        }
    } else {
        hideDialogue();
    }
}

function checkInteraction() {
    const playerPos = player.position;
    
    for (const npc of sceneObjects.npcs) {
        const dist = playerPos.distanceTo(npc.position);
        
        if (npc.userData.type === 'chest' && dist < 3) {
            if (!gameState.hasScarf) {
                gameState.hasScarf = true;
                document.getElementById('inventory').style.display = 'block';
                const scarf = npc.getObjectByName('scarf');
                if (scarf) scarf.visible = true;
                showDialogue("You found the Chelsea Blue Scarf! Now jump across the platforms to reach the Knight!");
            }
            return;
        }
        
        if (npc.userData.type === 'knight' && dist < 4) {
            gameState.currentNPC = 'knight';
            if (!gameState.hasScarf) {
                showDialogue("The Knight speaks: 'Halt! First find the Chelsea Blue Scarf, then return to me.'");
            } else {
                showDialogue("The Knight speaks: 'Only a true fan of the Blues may pass. Who is the King of Stamford Bridge and her all-time favorite Chelsea legend?'", true);
            }
            return;
        }
        
        if (npc.userData.type === 'helpSign' && dist < 3) {
            gameState.currentNPC = 'helpSign';
            showDialogue("💡 This path looks impossible! But legend says if you call the name of a loyal friend, help will come... Type a name to call for help!", true);
            return;
        }
        
        if (npc.userData.type === 'cheshire' && dist < 4) {
            gameState.currentNPC = 'cheshire';
            showDialogue("The Cheshire Cat grins: 'You've traveled far, little lion! The final door only opens for a melody. What is her all-time favorite band?'", true);
            return;
        }
        
        if (npc.userData.type === 'heartWardrobe' && dist < 4) {
            triggerEnding();
            return;
        }
    }
}

function transitionToScene(sceneNum) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;opacity:0;transition:opacity 1s;z-index:1000;';
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.style.opacity = '1', 10);
    
    setTimeout(() => {
        gameState.currentScene = sceneNum;
        if (sceneNum === 2) loadScene2();
        else if (sceneNum === 3) loadScene3();
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 1000);
        }, 500);
    }, 1000);
}

function triggerEnding() {
    gameState.gameEnded = true;
    
    const endScreen = document.getElementById('end-screen');
    endScreen.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #8b0a50 100%);
        display: flex; justify-content: center; align-items: center;
        z-index: 2000; opacity: 0; transition: opacity 2s;
    `;
    
    endScreen.innerHTML = `
        <div id="petals-container" style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;"></div>
        <div id="question-container" style="text-align:center;z-index:10;animation:fadeInUp 2s ease-out;">
            <h1 style="font-size:60px;color:#fff;text-shadow:3px 3px 0 #8b0a50,6px 6px 20px rgba(0,0,0,0.4);margin-bottom:40px;font-style:italic;font-family:Georgia,serif;">💕 Leps... 💕</h1>
            <p style="font-size:36px;color:#fff5f8;margin-bottom:40px;font-family:Georgia,serif;">Will you be my Valentine?</p>
            <div style="display:flex;justify-content:center;gap:40px;flex-wrap:wrap;">
                <button id="yes-btn" style="padding:20px 60px;font-size:28px;background:linear-gradient(180deg,#4caf50,#2e7d32);border:none;border-radius:30px;color:#fff;cursor:pointer;font-family:Georgia,serif;font-weight:bold;box-shadow:0 5px 20px rgba(0,0,0,0.3);transition:transform 0.2s;">Yes! 💖</button>
                <button id="no-btn" style="padding:20px 60px;font-size:28px;background:linear-gradient(180deg,#f44336,#c62828);border:none;border-radius:30px;color:#fff;cursor:pointer;font-family:Georgia,serif;font-weight:bold;box-shadow:0 5px 20px rgba(0,0,0,0.3);position:relative;transition:all 0.1s;">No 😢</button>
            </div>
        </div>
        <div id="final-message" style="display:none;text-align:center;z-index:10;">
            <h1 style="font-size:72px;color:#fff;text-shadow:3px 3px 0 #8b0a50,6px 6px 20px rgba(0,0,0,0.4);margin-bottom:30px;font-style:italic;font-family:Georgia,serif;">💕 Yay! 💕</h1>
            <p style="font-size:32px;color:#fff5f8;margin-bottom:15px;font-family:Georgia,serif;">Happy Valentine's Day, Leps!</p>
            <p style="font-size:22px;color:#ffe4ec;margin-bottom:25px;font-style:italic;font-family:Georgia,serif;">You are my greatest adventure and my favorite song.</p>
            <p style="font-size:28px;color:#ffd700;text-shadow:2px 2px 15px rgba(255,215,0,0.5);font-weight:bold;font-family:Georgia,serif;animation:pulse 2s ease-in-out infinite;">"I'm still loving you!"</p>
        </div>
        <style>
            @keyframes fadeInUp { 0% { opacity:0; transform:translateY(50px); } 100% { opacity:1; transform:translateY(0); } }
            @keyframes fall { 0% { transform:translateY(-20px) rotate(0deg); opacity:0; } 10% { opacity:0.8; } 90% { opacity:0.8; } 100% { transform:translateY(100vh) rotate(720deg); opacity:0; } }
            @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
            .petal { position:absolute; width:20px; height:20px; background:radial-gradient(ellipse at center,#ffb6c1 0%,#ff69b4 50%,#ff1493 100%); border-radius:50% 0 50% 50%; opacity:0.8; animation:fall linear infinite; }
            #yes-btn:hover { transform: scale(1.1); }
        </style>
    `;
    
    setTimeout(() => endScreen.style.opacity = '1', 10);
    
    // Setup the runaway No button!
    setTimeout(() => {
        const noBtn = document.getElementById('no-btn');
        const yesBtn = document.getElementById('yes-btn');
        const questionContainer = document.getElementById('question-container');
        const finalMessage = document.getElementById('final-message');
        
        // No button runs away from cursor!
        noBtn.addEventListener('mouseover', () => {
            const maxX = window.innerWidth - noBtn.offsetWidth - 50;
            const maxY = window.innerHeight - noBtn.offsetHeight - 50;
            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;
            noBtn.style.position = 'fixed';
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';
        });
        
        // Also run away on touch for mobile
        noBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const maxX = window.innerWidth - noBtn.offsetWidth - 50;
            const maxY = window.innerHeight - noBtn.offsetHeight - 50;
            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;
            noBtn.style.position = 'fixed';
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';
        });
        
        // Yes button shows the final message!
        yesBtn.addEventListener('click', () => {
            questionContainer.style.display = 'none';
            finalMessage.style.display = 'block';
            finalMessage.style.animation = 'fadeInUp 1s ease-out';
            
            // Play romantic "Still Loving You" inspired music!
            if (typeof playRomanticMusic === 'function') {
                playRomanticMusic();
            }
            
            // Start the petals!
            const petalsContainer = document.getElementById('petals-container');
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const petal = document.createElement('div');
                    petal.className = 'petal';
                    petal.style.left = Math.random() * 100 + '%';
                    petal.style.animationDuration = (3 + Math.random() * 4) + 's';
                    petal.style.animationDelay = Math.random() * 2 + 's';
                    petal.style.width = (15 + Math.random() * 15) + 'px';
                    petal.style.height = (15 + Math.random() * 15) + 'px';
                    petalsContainer.appendChild(petal);
                }, i * 100);
            }
        });
    }, 100);
}


// Physics and Movement
function updatePlayer() {
    if (gameState.dialogueActive || gameState.gameEnded) return;
    
    // If Tsushi is carrying, handle that separately - player can't move!
    if (gameState.tsushiCarrying && tsushiDog) {
        updateTsushiCarry();
        return;
    }
    
    // Normal movement only when not being carried
    playerVelocity.set(0, 0, 0);
    
    if (keys['w'] || keys['arrowup']) playerVelocity.z = -playerSpeed;
    if (keys['s'] || keys['arrowdown']) playerVelocity.z = playerSpeed;
    if (keys['a'] || keys['arrowleft']) playerVelocity.x = -playerSpeed;
    if (keys['d'] || keys['arrowright']) playerVelocity.x = playerSpeed;
    
    if (playerVelocity.length() > 0) {
        playerVelocity.normalize().multiplyScalar(playerSpeed);
    }
    
    player.position.x += playerVelocity.x;
    player.position.z += playerVelocity.z;
    
    // Rotate player
    if (playerVelocity.length() > 0) {
        const angle = Math.atan2(playerVelocity.x, playerVelocity.z);
        player.rotation.y = angle;
    }
    
    // Apply gravity
    gameState.velocityY += gravity;
    player.position.y += gameState.velocityY;
    
    // Check platform collisions
    let onPlatform = false;
    for (const platform of sceneObjects.platforms) {
        const p = platform.userData;
        if (player.position.x >= p.minX && player.position.x <= p.maxX &&
            player.position.z >= p.minZ && player.position.z <= p.maxZ) {
            if (player.position.y <= p.top + 1 && player.position.y >= p.top - 0.5 && gameState.velocityY <= 0) {
                player.position.y = p.top + 0.01;
                gameState.velocityY = 0;
                gameState.onGround = true;
                gameState.isJumping = false;
                onPlatform = true;
                break;
            }
        }
    }
    
    // Fall detection
    if (!onPlatform && player.position.y < -8) {
        // Respawn
        if (gameState.currentScene === 1) {
            player.position.set(0, 1, 5);
        } else if (gameState.currentScene === 2) {
            player.position.set(0, 1, 5);
        }
        gameState.velocityY = 0;
        gameState.onGround = true;
    }
    
    // Ground check for scene 3
    if (gameState.currentScene === 3 && player.position.y <= 0.01) {
        player.position.y = 0.01;
        gameState.velocityY = 0;
        gameState.onGround = true;
    }
    
    // Boundary
    player.position.x = Math.max(-25, Math.min(25, player.position.x));
    player.position.z = Math.max(-25, Math.min(25, player.position.z));
    
    // Animate tail
    const tail = player.getObjectByName('tail');
    if (tail) {
        tail.rotation.y = Math.sin(Date.now() * 0.01) * 0.3;
    }
}

function updateTsushiCarry() {
    if (!tsushiDog) return;
    
    // Find Cheshire Cat position
    let catPos = new THREE.Vector3(0, 10, -16);
    for (const npc of sceneObjects.npcs) {
        if (npc.userData.type === 'cheshire') {
            catPos.copy(npc.position);
            catPos.y -= 1;
            catPos.z += 2;
            break;
        }
    }
    
    // Move Tsushi towards cat
    const direction = new THREE.Vector3().subVectors(catPos, tsushiDog.position);
    const distance = direction.length();
    
    if (distance > 1) {
        direction.normalize().multiplyScalar(0.15);
        tsushiDog.position.add(direction);
        
        // Face direction of travel
        tsushiDog.rotation.y = Math.atan2(direction.x, direction.z);
        
        // Animate wings
        const time = Date.now() * 0.01;
        const leftWing = tsushiDog.getObjectByName('leftWing');
        const rightWing = tsushiDog.getObjectByName('rightWing');
        if (leftWing) leftWing.rotation.z = Math.sin(time) * 0.5 + 0.3;
        if (rightWing) rightWing.rotation.z = -Math.sin(time) * 0.5 - 0.3;
        
        // Animate sparkles
        tsushiDog.children.forEach(child => {
            if (child.name === 'sparkle') {
                child.position.y = 1 + Math.sin(time + child.userData.angle) * 0.3;
            }
        });
    } else {
        // Arrived! Remove Tsushi
        gameState.tsushiCarrying = false;
        scene.remove(tsushiDog);
        tsushiDog = null;
        
        player.position.copy(catPos);
        player.position.y = catPos.y;
        gameState.onGround = true;
        gameState.velocityY = 0;
        
        showDialogue("Tsushi: 'Here you go, little lion! Good luck with the riddle!' 🐕💕");
        setTimeout(() => hideDialogue(), 2500);
    }
    
    // ALWAYS keep player locked on Tsushi while carrying
    if (tsushiDog && gameState.tsushiCarrying) {
        player.position.copy(tsushiDog.position);
        player.position.y = tsushiDog.position.y + 1.5;
        gameState.velocityY = 0; // No gravity while on Tsushi
        gameState.onGround = false;
    }
}

function updateCamera() {
    let targetX = player.position.x;
    let targetY = player.position.y + 6;
    let targetZ = player.position.z + 12;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(player.position.x, player.position.y + 1, player.position.z);
}

function updateParticles() {
    if (snowParticles && gameState.currentScene === 1) {
        const positions = snowParticles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= 0.05;
            positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.01;
            if (positions[i + 1] < -5) positions[i + 1] = 20;
        }
        snowParticles.geometry.attributes.position.needsUpdate = true;
    }
    
    if (magicParticles && gameState.currentScene === 2) {
        const positions = magicParticles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += 0.02;
            positions[i] += Math.sin(Date.now() * 0.002 + i) * 0.02;
            if (positions[i + 1] > 15) positions[i + 1] = 0;
        }
        magicParticles.geometry.attributes.position.needsUpdate = true;
    }
}

function updateAnimations() {
    const time = Date.now() * 0.001;
    
    sceneObjects.npcs.forEach(npc => {
        if (npc.userData.type === 'cheshire' && npc.userData.baseY) {
            npc.position.y = npc.userData.baseY + Math.sin(time * 2) * 0.3;
        }
        
        if (npc.userData.type === 'heartWardrobe') {
            npc.children.forEach(child => {
                if (child.name === 'sparkle') {
                    child.position.y = child.userData.baseY + Math.sin(time * 3 + child.userData.angle) * 0.3;
                }
            });
            const scale = 1 + Math.sin(time * 2) * 0.05;
            npc.scale.set(scale, scale, scale);
        }
    });
    
    if (gameState.currentScene === 3) {
        sceneObjects.objects.forEach(obj => {
            if (obj.name === 'floatingHeart') {
                obj.position.y = obj.userData.baseY + Math.sin(time * obj.userData.speed + obj.userData.offset) * 0.5;
                obj.rotation.y += 0.01;
            }
        });
    }
    
    // Animate Tsushi if present and not carrying
    if (tsushiDog && !gameState.tsushiCarrying) {
        const dogTail = tsushiDog.getObjectByName('dogTail');
        if (dogTail) dogTail.rotation.y = Math.sin(time * 10) * 0.5;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    updatePlayer();
    updateCamera();
    updateParticles();
    updateAnimations();
    
    renderer.render(scene, camera);
}

// ============ MUSIC SYSTEM ============
let audioContext = null;
let musicPlaying = false;
let currentMelody = null;
let masterGain = null;

// Musical notes frequencies
const notes = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50
};

// Fairytale melody for gameplay (whimsical, magical)
const gameplayMelody = [
    { note: 'E4', duration: 0.4 }, { note: 'G4', duration: 0.4 }, { note: 'C5', duration: 0.6 },
    { note: 'B4', duration: 0.3 }, { note: 'A4', duration: 0.3 }, { note: 'G4', duration: 0.6 },
    { note: 'E4', duration: 0.4 }, { note: 'F4', duration: 0.4 }, { note: 'G4', duration: 0.4 },
    { note: 'A4', duration: 0.8 }, { note: 'G4', duration: 0.4 }, { note: 'E4', duration: 0.4 },
    { note: 'D4', duration: 0.6 }, { note: 'E4', duration: 0.3 }, { note: 'F4', duration: 0.3 },
    { note: 'G4', duration: 0.8 }, { note: 'C5', duration: 0.4 }, { note: 'B4', duration: 0.4 },
    { note: 'A4', duration: 0.6 }, { note: 'G4', duration: 0.6 }, { note: 'E4', duration: 0.8 },
    { note: 'G4', duration: 0.4 }, { note: 'A4', duration: 0.4 }, { note: 'B4', duration: 0.4 },
    { note: 'C5', duration: 1.0 }
];

// "Still Loving You" inspired romantic melody for ending
const romanticMelody = [
    { note: 'E4', duration: 0.8 }, { note: 'G4', duration: 0.4 }, { note: 'A4', duration: 0.8 },
    { note: 'G4', duration: 0.4 }, { note: 'E4', duration: 0.8 }, { note: 'D4', duration: 0.8 },
    { note: 'E4', duration: 1.2 }, { note: 'G4', duration: 0.4 }, { note: 'A4', duration: 0.8 },
    { note: 'B4', duration: 0.4 }, { note: 'C5', duration: 1.2 }, { note: 'B4', duration: 0.4 },
    { note: 'A4', duration: 0.8 }, { note: 'G4', duration: 0.8 }, { note: 'E4', duration: 1.2 },
    { note: 'D4', duration: 0.4 }, { note: 'E4', duration: 0.8 }, { note: 'G4', duration: 0.8 },
    { note: 'A4', duration: 1.6 }, { note: 'G4', duration: 0.8 }, { note: 'E4', duration: 1.6 }
];

function initAudio() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(audioContext.destination);
}

function playNote(frequency, startTime, duration, type = 'sine') {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    // Soft attack and release for dreamy sound
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + duration * 0.5);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(masterGain);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
}

function playMelody(melody, loop = true) {
    if (!audioContext) initAudio();
    
    let time = audioContext.currentTime + 0.1;
    const totalDuration = melody.reduce((sum, n) => sum + n.duration, 0);
    
    function scheduleMelody() {
        melody.forEach(({ note, duration }) => {
            if (notes[note]) {
                // Main melody
                playNote(notes[note], time, duration * 0.9, 'sine');
                // Soft harmony
                playNote(notes[note] * 0.5, time, duration * 0.9, 'triangle');
            }
            time += duration;
        });
    }
    
    scheduleMelody();
    
    if (loop) {
        currentMelody = setInterval(() => {
            time = audioContext.currentTime + 0.1;
            scheduleMelody();
        }, totalDuration * 1000);
    }
}

function stopMusic() {
    if (currentMelody) {
        clearInterval(currentMelody);
        currentMelody = null;
    }
}

function toggleMusic() {
    const btn = document.getElementById('music-btn');
    
    if (!musicPlaying) {
        initAudio();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        playMelody(romanticMelody);
        musicPlaying = true;
        btn.textContent = '🎵 Music On';
    } else {
        stopMusic();
        musicPlaying = false;
        btn.textContent = '🎵 Play Music';
    }
}

function playRomanticMusic() {
    stopMusic();
    if (audioContext) {
        playMelody(romanticMelody);
    }
}

// Setup music button
document.getElementById('music-btn').addEventListener('click', toggleMusic);

// Start the game
init();

console.log("🏰 Leps' Chronicles of WonderCore - 3D Edition");
console.log("A Valentine's Day Adventure");
console.log("Controls: WASD to move, SPACE to jump, E to interact");
console.log("💡 In Scene 2, type 'Tsushi' to call for help!");
console.log("🎵 Click the music button to play fairytale music!");
