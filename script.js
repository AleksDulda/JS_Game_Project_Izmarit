const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width= 800 ;
canvas.height = 500;

const keys= [];

const player= { // bu kısım karakterin pngsinin boyutunun ayarının yapıldığı yer
    x: 200,
    y: 200,
    width:32,
    height:32,
    frameX: 0,
    frameY: 1,
    speed:3,
    moving: false

};

//Arka plan ve karakter resmi atamaları

const playerSprite = new Image();
playerSprite.src = "npc3.png";
const background= new Image(); 
background.src="bg1.png";

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH ){ //karakterin kordinatları ve yönleri

    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);

}

//Bu bölüm klavyeden tuşlara basıldığında ve tuşlar serbest bırakıldığında neler olacağını belirtir
window.addEventListener("keydown",function(e){//

    keys[e.keyCode]=true;
    player.moving=true;

});
window.addEventListener("keyup",function(e){
delete keys[e.keyCode];
player.moving=false;
});

//T tuşuna basıldığında kullanılacak default özel güç
window.addEventListener("keydown", function(e) {
    if (e.key === 't' || e.key === 'T') {
        resetObstacles();
    }
});

//Z tuşuna basıldığında kullanılacak özel güç
window.addEventListener("keydown", function(e) {
    if (e.key === 'z' || e.key === 'Z') {
        if (collectedPower > 0) { // Gerekli kontroller
            collectedPower--; 
            remainingTime += 5; // Süreye 5 saniye ekle
            updateCounterPower(); 
            updateTimer(); // Süreyi güncelle
        }
    }
});



window.addEventListener("keydown", function(e) {
    if ((e.key === 'd' || e.key === 'D')) {
        // D tuşuna basıldığında nesnelerin hızını azaltacak fonksiyon
        function slowDownObjects() {
            if (collectedPower >= 2) { // 2 özel güç harcandığında
                collectedPower -= 2; // Özel gücü harcar
                updateCounterPower();
                // Özel güç kullanıldığında oluşacak hız azalması için her iki nesnenin hızını azalt
                obstacles.forEach(obstacle => {
                    obstacle.speed *= 0.5; // Hızı yarıya indirir
                });
                powers.forEach(power => {
                    power.speed *= 0.5; // Hızı yarıya indirir
                });
            }
        }
        
        // Fonksiyonu çağır
        slowDownObjects();
    }
});

//reset yapılınca izmariteri sıfırlar

function resetObstacles() {
    collectedObjects += obstacles.length; 
    obstacles.length = 0;
    obstacleCount = 0; 
    updateCounter(); 
}

//Karakter sağa sola (38,37,40,39 ok yönlerinin kodlarıdır) döndüğünde animasyon verebilmek için

function movePlayer(){
    if(keys[38] && player.y>0){
        player.y-=player.speed;
        player.frameY = 2;
        player.moving=true;

    }
    if(keys[37] && player.x>0){
       player.x-=player.speed;
       player.frameY = 3;
       player.moving=true;

    }
    if(keys[40] && player.y < canvas.height - player.height){
        player.y+=player.speed;
        player.frameY = 0;
        player.moving=true;

     }
     if(keys[39] && player.x <canvas.width - player.width){
        player.x+=player.speed;
        player.frameY = 1;
        player.moving=true;

     }
}
//bu da ana karakterin animasyonları
function handlePlayerFrame(){
  if(player.frameX<3 && player.moving)  {
    player.frameX++;
  }
  else
    player.frameX =0 ;
}

let fps, fpsInterval, startTime,  now, then, elapsed;
//fps görüntüyü kendimize göre kaç kare ayarlamak istediğimiz kısımdır
function startAnimating(fps){
    fpsInterval = 1000/fps;
    then= Date.now();
    startTime= then;
    animate();
    
}

//burada atamalar yapılır oluşacak izmarit ve saat için
const maxObstacles = 10;
const maxPowers = 10;

let obstacleCount = 0;
let powerCount = 0;

let speedCount = 0;

const obstacles = [];
const powers = [];

// Rastgele öğe oluşturma fonksiyonu
function createObstacle() {
    const obstacle = {
        x: canvas.width, 
        y: Math.random() * canvas.height, // Y ekseninde rastgele bir konum
        width: 50, 
        height: 50, 
        speed: 0.5+speedCount // Rastgele bir hız
    };
    obstacles.push(obstacle); // Oluşturulan öğeyi listeye ekle
}
function createPower() {
    const power = {
        x: canvas.width, 
        y: Math.random() * canvas.height, // Y ekseninde rastgele bir konum
        width: 50, 
        height: 50, 
        speed: 0.5 + speedCount // Rastgele bir hız
    };
    powers.push(power); // Oluşturulan gücü listeye ekle
}


// Rastgele öğeleri ekrana çizme fonksiyonu
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'red'; 
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height); 
    });
}

function drawPowers() {
    powers.forEach(power => {
        ctx.fillStyle = 'blue'; 
        ctx.fillRect(power.x, power.y, power.width, power.height); 
    });
}

function moveObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacle.speed; // Hız kadar sola hareket
        
        // Eğer öğe ekranın solundan çıktıysa
        if (obstacle.x + obstacle.width < 0) {
            obstacle.x = canvas.width; // Ekranın sağ tarafından başlat
            obstacle.y = Math.random() * canvas.height; 
            obstacle.speed = 0.5; 
        }
    });
    
    checkCollision(); // Çarpışma kontrolünü yap

    
    // Ekranın dışına çıkan öğeleri listeden kaldırır
    obstacles.forEach((obstacle, index) => {
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    });
}
function movePowers() {
    powers.forEach(power => {
        power.x -= power.speed; // Hız kadar sola hareket
        
        // Eğer öğe ekranın solundan çıktıysa
        if (power.x + power.width < 0) {
            power.x = canvas.width; // Ekranın sağ tarafından başlat
            power.y = Math.random() * canvas.height; 
            power.speed = 0.5;
        }
    });
    
    checkCollisionPower(); // Çarpışma kontrolünü yap 

    
    // Ekranın dışına çıkan öğeleri listeden kaldırır
    powers.forEach((power, index) => {
        if (power.x + power.width < 0) {
            powers.splice(index, 1);
        }
    });
}


function updateObstacles() {
    if (Math.random() < 0.01 && obstacleCount < maxObstacles) { // Belirli bir olasılıkta ve maksimum sayıya ulaşılmadığında yeni öğe oluştur
        createObstacle();
        obstacleCount++;
        speedCount+=0.05;

    }
}
function updatePowers() {
    if (Math.random() < 0.0005 && powerCount < maxPowers) { // Belirli bir olasılıkta ve maksimum sayıya ulaşılmadığında yeni öğe oluştur
        createPower();
        powerCount++;
        speedCount+=0.05;

    }
}
function checkCollision() {
    obstacles.forEach((obstacle, index) => {
        if (
            player.x < obstacle.x + obstacle.width && //Gerekli kontroller
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            obstacles.splice(index, 1); // Çarpışma durumunda öğeyi listeden kaldır
            obstacleCount--; 
            collectedObjects++; 
            updateCounter(); 
        }
    });
}

function checkCollisionPower() {
    powers.forEach((power, index) => {
        if (
            player.x < power.x + power.width && //Gerekli kontroller
            player.x + player.width > power.x &&
            player.y < power.y + power.height &&
            player.y + player.height > power.y
        ) {
            powers.splice(index, 1); // Çarpışma durumunda gücü listeden kaldır
            powerCount--; 
            collectedPower++; 
            updateCounterPower(); 
        }
    });
}




//Ekrana Çizdirme

function drawObstacles() {
    obstacles.forEach(obstacle => {
        const obstacleImage = new Image();
        obstacleImage.src = 'izmarit.png'; // Resmin yolu
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}
function drawPowers() {
    powers.forEach(power => {
        const powerImage = new Image();
        powerImage.src = 'clock.png'; // Resmin yolu
        ctx.drawImage(powerImage, power.x, power.y, power.width, power.height);
    });
}


//Skor Tablosu ve sayaçlar için oluşturulmuş satırlar

const counter = document.createElement('div');
counter.style.position = 'absolute';
counter.style.top = '10px';
counter.style.right = '10px';
counter.style.padding = '10px';
counter.style.background = '#ffffff';
counter.style.border = '2px solid #000000';
document.body.appendChild(counter);

const powerCounter = document.createElement('div');
powerCounter.style.position = 'absolute';
powerCounter.style.top = '100px';
powerCounter.style.right = '10px';
powerCounter.style.padding = '10px';
powerCounter.style.background = '#ffffff';
powerCounter.style.border = '2px solid #000000';
document.body.appendChild(powerCounter);

const timer = document.createElement('div');
timer.style.position = 'absolute';
timer.style.bottom = '10px';
timer.style.right = '10px';
timer.style.padding = '10px';
timer.style.background = '#ffffff';
timer.style.border = '2px solid #000000';
document.body.appendChild(timer);


let collectedObjects = 0;
let collectedPower= 0;

let remainingTime = 60;
let animateID; // requestAnimationFrame() fonksiyonunun geri dönüş değeri

//Güncelleme ve bildiri fonksiyonları

function updateCounter() {
    counter.innerText = 'Toplanan İzmarit: ' + collectedObjects;
}

function updateCounterPower() {
    powerCounter.innerText = 'Toplanan Saat: ' + collectedPower; // Burada powerCounter kullanın
}


function updateTimer() {
    timer.innerText = 'Kalan Süre: ' + remainingTime + ' sn';
}
//Oyun başladığında sayacı başlatır
function startTimer() {
    const timerInterval = setInterval(() => {
        remainingTime--;
        updateTimer();
        if (remainingTime === 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

//Oyun bittiğinde alert verir süre dolunca
function gameOver() {
    alert("Oyun bitti! Süre doldu. "+"Toplanan İzmarit"+ " "+ collectedObjects);
    cancelAnimationFrame(animateID);
    const restartButton = document.getElementById('restartButton');

    restartButton.addEventListener('click', function() {
    window.location.reload(); // Sayfayı yeniden yükle
    });
}



//burası animasyonu başlatmak içindir main fonksiyon gibi düşünülebilir

function animate() {
    animateID = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
    movePlayer();
    handlePlayerFrame();
    drawObstacles();
    moveObstacles();
    updateObstacles();
    checkCollision();
    drawPowers();
    movePowers();
    updatePowers();
    checkCollisionPower(); // Bu satırı ekleyin
}
//Burasıda sürekli updateleri kontrol eder güncel kalmasını sağlar
updateCounter();
updateCounterPower();
updateTimer();
startTimer();
startAnimating(20);
