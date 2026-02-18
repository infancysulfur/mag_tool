from flask import Flask, render_template, jsonify, request
import math

app = Flask(__name__)

# 한글 색상 데이터 (예시 데이터 - 나중에 실제 데이터로 교체 가능)
# CMYK 기준으로 매칭하기 위해 미리 정의된 리스트
COLOR_DB = [
    # --- 무채색계 (無彩色界) ---
    {"name": "흑백", "hex": "#1D1E23", "cmyk": (93, 89, 83, 52)},
    {"name": "백색", "hex": "#FFFFFF", "cmyk": (0, 0, 0, 0)},
    {"name": "회색", "hex": "#A4AAA7", "cmyk": (38, 27, 31, 0)},
    {"name": "구색", "hex": "#959EA2", "cmyk": (45, 32, 32, 0)},
    {"name": "치색", "hex": "#616264", "cmyk": (72, 64, 62, 4)},
    {"name": "연지회색", "hex": "#6F606E", "cmyk": (55, 58, 40, 20)},
    {"name": "설백색", "hex": "#DDE7E7", "cmyk": (12, 4, 7, 0)},
    {"name": "유백색", "hex": "#E7E6D2", "cmyk": (9, 5, 18, 0)},
    {"name": "지백색", "hex": "#E3DDCB", "cmyk": (6, 6, 17, 4)},
    {"name": "소색", "hex": "#D8C8B2", "cmyk": (10, 15, 26, 5)},

    # --- 적색계 (赤色界) ---
    {"name": "적색", "hex": "#B82647", "cmyk": (21, 98, 68, 8)},
    {"name": "홍색", "hex": "#F15B5B", "cmyk": (0, 80, 60, 0)},
    {"name": "적토색", "hex": "#9F494C", "cmyk": (29, 80, 64, 17)},
    {"name": "휴색", "hex": "#683235", "cmyk": (40, 80, 66, 44)},
    {"name": "갈색", "hex": "#966147", "cmyk": (31, 61, 73, 21)},
    {"name": "호박색", "hex": "#BD7F41", "cmyk": (21, 51, 84, 8)},
    {"name": "추향색", "hex": "#C38866", "cmyk": (19, 48, 61, 6)},
    {"name": "육색", "hex": "#D77964", "cmyk": (11, 62, 59, 2)},
    {"name": "주색", "hex": "#CA5E59", "cmyk": (15, 75, 62, 4)},
    {"name": "주홍색", "hex": "#C23352", "cmyk": (18, 94, 60, 5)},
    {"name": "담주색", "hex": "#EA8474", "cmyk": (4, 59, 50, 0)},
    {"name": "진홍색", "hex": "#BF2F7B", "cmyk": (20, 94, 17, 4)},
    {"name": "선홍색", "hex": "#CE5A9E", "cmyk": (16, 79, 2, 0)},
    {"name": "연지색", "hex": "#BE577B", "cmyk": (19, 77, 28, 7)},
    {"name": "훈색", "hex": "#D97793", "cmyk": (9, 64, 20, 2)},
    {"name": "진분홍색", "hex": "#DB4E9C", "cmyk": (9, 84, 0, 0)},
    {"name": "분홍색", "hex": "#E2A6B4", "cmyk": (7, 39, 14, 1)},
    {"name": "연분홍색", "hex": "#E0709B", "cmyk": (6, 69, 11, 1)},
    {"name": "장단색", "hex": "#E16350", "cmyk": (6, 75, 70, 1)},
    {"name": "석간주색", "hex": "#8A4C44", "cmyk": (30, 71, 65, 30)},
    {"name": "흑홍색", "hex": "#8E6F80", "cmyk": (40, 54, 31, 15)},

    # --- 황색계 (黃色界) ---
    {"name": "황색", "hex": "#F9D537", "cmyk": (3, 13, 89, 0)},
    {"name": "유황색", "hex": "#EBBC6B", "cmyk": (6, 25, 67, 1)},
    {"name": "명황색", "hex": "#FEE134", "cmyk": (2, 7, 89, 0)},
    {"name": "담황색", "hex": "#F5F0C5", "cmyk": (4, 2, 27, 0)},
    {"name": "송화색", "hex": "#F8E77F", "cmyk": (4, 4, 62, 0)},
    {"name": "자황색", "hex": "#F7B938", "cmyk": (2, 29, 89, 0)},
    {"name": "행황색", "hex": "#F1A55A", "cmyk": (3, 40, 73, 0)},
    {"name": "두록색", "hex": "#E5B98F", "cmyk": (8, 27, 45, 1)},
    {"name": "적황색", "hex": "#ED9149", "cmyk": (4, 51, 80, 0)},
    {"name": "토황색", "hex": "#C8852C", "cmyk": (18, 50, 97, 5)},
    {"name": "지황색", "hex": "#D6B038", "cmyk": (14, 26, 91, 3)},
    {"name": "토색", "hex": "#9A6B31", "cmyk": (30, 54, 91, 20)},
    {"name": "치자색", "hex": "#F6CF7A", "cmyk": (3, 18, 61, 0)},
    {"name": "홍황색", "hex": "#DDA28F", "cmyk": (9, 39, 38, 2)},
    {"name": "자황색(중복)", "hex": "#BB9E8B", "cmyk": (22, 33, 40, 7)},

    # --- 청록색계 (靑綠色界) ---
    {"name": "청색", "hex": "#0B6DB7", "cmyk": (89, 56, 0, 0)},
    {"name": "벽색", "hex": "#00B5E3", "cmyk": (73, 5, 4, 0)},
    {"name": "천청색", "hex": "#5AC6D0", "cmyk": (59, 0, 20, 0)},
    {"name": "담청색", "hex": "#00A6A9", "cmyk": (96, 4, 40, 0)},
    {"name": "취람색", "hex": "#5DC19B", "cmyk": (62, 0, 51, 0)},
    {"name": "양람색", "hex": "#6C71B5", "cmyk": (64, 58, 0, 0)},
    {"name": "벽청색", "hex": "#448CCB", "cmyk": (72, 36, 0, 0)},
    {"name": "청현색", "hex": "#006494", "cmyk": (99, 59, 22, 3)},
    {"name": "감색", "hex": "#026892", "cmyk": (93, 57, 26, 2)},
    {"name": "남색", "hex": "#6A5BA8", "cmyk": (68, 73, 0, 0)},
    {"name": "연람색", "hex": "#7963AB", "cmyk": (60, 69, 0, 0)},
    {"name": "벽람색", "hex": "#6979BB", "cmyk": (64, 52, 0, 0)},
    {"name": "숙람색", "hex": "#45436C", "cmyk": (86, 84, 40, 9)},
    {"name": "군청색", "hex": "#4F599F", "cmyk": (80, 73, 6, 0)},
    {"name": "녹색", "hex": "#417141", "cmyk": (82, 44, 95, 9)},
    {"name": "명록색", "hex": "#16AA52", "cmyk": (81, 5, 94, 0)},
    {"name": "유록색", "hex": "#6AB048", "cmyk": (64, 8, 97, 0)},
    {"name": "유청색", "hex": "#569A49", "cmyk": (72, 20, 96, 1)},
    {"name": "연두색", "hex": "#C0D84D", "cmyk": (29, 0, 87, 0)},
    {"name": "춘유록색", "hex": "#CBDD61", "cmyk": (24, 0, 78, 0)},
    {"name": "청록색", "hex": "#009770", "cmyk": (97, 15, 74, 0)},
    {"name": "진초록색", "hex": "#0A8D5E", "cmyk": (87, 26, 82, 1)},
    {"name": "초록색", "hex": "#1C9249", "cmyk": (85, 20, 98, 2)},
    {"name": "흑록색", "hex": "#2E674E", "cmyk": (89, 52, 83, 9)},
    {"name": "비색", "hex": "#72C6A5", "cmyk": (55, 0, 45, 0)},
    {"name": "옥색", "hex": "#9ED6C0", "cmyk": (38, 0, 30, 0)},
    {"name": "삼청색", "hex": "#5C6EB4", "cmyk": (71, 59, 0, 0)},
    {"name": "뇌록색", "hex": "#397664", "cmyk": (74, 27, 59, 6)},
    {"name": "양록색", "hex": "#31B675", "cmyk": (74, 0, 74, 0)},
    {"name": "하엽색", "hex": "#245441", "cmyk": (83, 43, 75, 39)},
    {"name": "흑청색", "hex": "#1583AF", "cmyk": (84, 39, 17, 0)},
    {"name": "청벽색", "hex": "#18B4E9", "cmyk": (69, 8, 0, 0)},

    # --- 자색계 (紫色界) ---
    {"name": "자색", "hex": "#6D1B43", "cmyk": (41, 95, 45, 40)},
    {"name": "자주색", "hex": "#89236A", "cmyk": (40, 96, 18, 20)},
    {"name": "보라색", "hex": "#9C4998", "cmyk": (42, 85, 1, 1)},
    {"name": "홍람색", "hex": "#733E7F", "cmyk": (58, 85, 10, 15)},
    {"name": "포도색", "hex": "#5D3462", "cmyk": (70, 90, 35, 20)},
    {"name": "청자색", "hex": "#403F95", "cmyk": (90, 90, 1, 1)},
    {"name": "벽자색", "hex": "#84A7D3", "cmyk": (47, 25, 1, 1)},
    {"name": "회보라색", "hex": "#B3A7CD", "cmyk": (28, 32, 1, 1)},
    {"name": "담자색", "hex": "#BEA3C9", "cmyk": (23, 36, 1, 1)},
    {"name": "다자색", "hex": "#47302E", "cmyk": (75, 86, 85, 35)},
    {"name": "적자색", "hex": "#BA4160", "cmyk": (15, 86, 42, 13)}
]

# def calculate_similarity(c1, c2):
#     # 유클리드 거리를 이용한 유사도 계산 (단순화)
#     distance = math.sqrt((c1['c']-c2['c'])**2 + (c1['m']-c2['m'])**2 + 
#                          (c1['y']-c2['y'])**2 + (c1['k']-c2['k'])**2)
#     # 최대 거리는 200 (0~100 범위 4개)
#     similarity = max(0, 100 - (distance / 2))
#     return round(similarity, 1)
def calculate_similarity(c1, c2):
    # CMYK 값 사이의 유클리드 거리 계산
    distance = math.sqrt(sum([(a - b) ** 2 for a, b in zip(c1, c2)]))
    # 최대 거리는 sqrt(100^2 * 4) = 200이므로 이를 기준으로 % 환산
    similarity = max(0, 100 - (distance / 200) * 100)
    return round(similarity, 1)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_korean_name', methods=['POST'])
def get_korean_name():
    data = request.json
    user_cmyk = (
        data['cmyk']['c'],
        data['cmyk']['m'],
        data['cmyk']['y'],
        data['cmyk']['k']
    )

    # DB의 모든 색상과 비교하여 유사도 계산
    results = []
    for color in COLOR_DB:
        sim = calculate_similarity(user_cmyk, color['cmyk'])
        results.append({
            "name": color['name'],
            "hex": color['hex'],
            "similarity": sim
        })

    # 유사도 높은 순으로 정렬 후 Top 3 추출
    top3 = sorted(results, key=lambda x: x['similarity'], reverse=True)[:3]
    
    return jsonify(top3)

if __name__ == '__main__':
    app.run(debug=True)