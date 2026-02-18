// 1. 초기 설정 및 탭 전환 기능
function openTab(tabName) {
    const contents = document.getElementsByClassName('tab-content');
    for (let content of contents) {
        content.style.display = 'none';
    }
    document.getElementById(tabName).style.display = 'block';
}

// 2. 색상 변환 유틸리티 (HEX -> RGB -> CMYK)
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function rgbToCmyk(r, g, b) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);

    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);

    return { c, m, y, k };
}

function cmykToRgb(c, m, y, k) {
    const r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
    const g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
    const b = Math.round(255 * (1 - y / 100) * (1 - k / 100));
    return `rgb(${r}, ${g}, ${b})`;
}

// 3. [탭 1] 색상 팔레트 및 한글 이름 업데이트
async function updateColorInfo(hex) {
    const rgb = hexToRgb(hex);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    // 화면 UI 업데이트
    document.getElementById('hexVal').innerText = hex.toUpperCase();
    document.getElementById('rgbVal').innerText = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    document.getElementById('cmykVal').innerText = `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`;

    // Flask 서버에 한글 이름 요청
    const response = await fetch('/get_color_name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmyk)
    });
    const topColors = await response.json();

    // 결과 목록 갱신
    const nameList = document.getElementById('nameList');
    nameList.innerHTML = topColors.map((color, index) => 
        `<li>${index + 1}. ${color.name} (${color.similarity}%)</li>`
    ).join('');
}

// 4. [탭 2] 색상 섞기 기능
function addRow() {
    const container = document.getElementById('rowsContainer');
    const newRow = document.createElement('div');
    newRow.className = 'color-row';
    newRow.innerHTML = `
        <input type="color" class="mix-color" value="#ff0000" onchange="mixColors()">
        <input type="number" class="mix-amount" value="1" min="1" oninput="mixColors()">
    `;
    container.appendChild(newRow);
    mixColors();
}

function removeRow() {
    const rows = document.querySelectorAll('.color-row');
    if (rows.length > 2) {
        rows[rows.length - 1].remove();
        mixColors();
    }
}

function mixColors() {
    const rows = document.querySelectorAll('.color-row');
    let totalC = 0, totalM = 0, totalY = 0, totalK = 0, totalAmount = 0;

    rows.forEach(row => {
        const hex = row.querySelector('.mix-color').value;
        const amount = parseFloat(row.querySelector('.mix-amount').value) || 0;
        const rgb = hexToRgb(hex);
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

        totalC += cmyk.c * amount;
        totalM += cmyk.m * amount;
        totalY += cmyk.y * amount;
        totalK += cmyk.k * amount;
        totalAmount += amount;
    });

    if (totalAmount > 0) {
        const avgC = totalC / totalAmount;
        const avgM = totalM / totalAmount;
        const avgY = totalY / totalAmount;
        const avgK = totalK / totalAmount;
        
        const resultBox = document.getElementById('mixedResult');
        resultBox.style.backgroundColor = cmykToRgb(avgC, avgM, avgY, avgK);
    }
}

// 초기 실행
window.onload = () => {
    updateColorInfo('#ffffff');
    mixColors();
};