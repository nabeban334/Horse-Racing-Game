
// ゲームの基本設定
const INITIAL_MONEY = 100000;
const TOTAL_RACES = 12;

let money = INITIAL_MONEY;
let currentRace = 1;
let currentHorses = [];
let currentBets = [];
let raceStarted = false;
let horseSortMode = "number";
let todayRacecourse = "";
let totalBetAmount = 0;
let totalPayoutAmount = 0;
let totalHitCount = 0;
let totalTicketCount = 0;
let todayWeather = "";
let todayGroundCondition = "";
let isBigUpsetRace = false;

// ゲームを開始する
function startGame() {
    // 画面を切り替える
    document.getElementById("title-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";

    window.scrollTo(0, 0);

    // ゲームの状態を初期化
    currentRace = 1;
    money = INITIAL_MONEY;

    totalBetAmount = 0;
    totalPayoutAmount = 0;
    totalHitCount = 0;
    totalTicketCount = 0;

    currentBets = [];
    raceStarted = false;

    // 競馬場をランダムに決定
    todayRacecourse = racecourses[
        randomInt(0, racecourses.length - 1)
    ];
    // 1日を通して共通の天気を決定
    todayWeather = weatherList[
        randomInt(0, weatherList.length - 1)
    ];
    // 1日を通して共通の馬場状態を決定
    todayGroundCondition = groundConditions[
        randomInt(0, groundConditions.length - 1)
    ];

    // 第1レースを初期化
    initializeRace();
}


const raceSchedule = [
    { name: "3歳未勝利", distance: 1600, ground: "芝" },
    { name: "3歳未勝利", distance: 1400, ground: "ダート" },
    { name: "2歳未勝利", distance: 2000, ground: "芝" },
    { name: "2歳未勝利", distance: 1800, ground: "ダート" },
    { name: "新馬戦", distance: 2000, ground: "芝" },
    { name: "新馬戦", distance: 1600, ground: "芝" },
    { name: "3歳以上1勝クラス", distance: 1500, ground: "ダート" },
    { name: "3歳以上2勝クラス", distance: 1800, ground: "芝" },
    { name: "四季特別", distance: 1200, ground: "芝" },
    { name: "若駒ステークス", distance: 2000, ground: "芝" },
    { name: "グランドジャンプ", distance: 4100, ground: "芝・ダート" },
    { name: "ジャパンレジェンドカップ（GI）", distance: 2400, ground: "芝" }
];

// 使用する競馬場
const racecourses = [
    "東京競馬場",
    "中山競馬場",
    "阪神競馬場",
    "京都競馬場"
];

// 天気の種類
const weatherList = [
    "晴",
    "曇",
    "雨",
];

// 馬場状態の種類
const groundConditions = [
    "良",
    "稍重",
    "重",
    "不良"
];

// 架空の馬名を生成するための言葉
const nameFirst = [
    "ミッドナイト", "サンダー", "ブルー",
    "ゴールデン", "シャイニング", "シルバー",
    "クリスタル", "レッド", "スター",
    "グランド", "ホワイト", "ダーク",
    "スカイ", "ファントム", "ロイヤル",
    "フローラル", "ラピス", "ネオ"
];

const nameLast = [
    "スター", "ブレイブ", "ハート",
    "ファルコン", "ドラゴン", "ウィング",
    "ロード", "レジェンド", "フェザー",
    "スピリット", "アロー", "キング",
    "クイーン", "シャドウ", "ドリーム",
    "エース", "フラッシュ", "ビクトリー"
];

// ランダムな整数
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 架空の馬名を作る
function generateHorseName(usedNames) {
    let name;

    do {
        const first = nameFirst[
            randomInt(0, nameFirst.length - 1)
        ];

        const last = nameLast[
            randomInt(0, nameLast.length - 1)
        ];

        name = first + last;

    } while (usedNames.has(name));

    usedNames.add(name);
    return name;
}


// 脚質の種類
const runningStyles = [
    "逃げ",
    "先行",
    "差し",
    "追込"
];

// 競走馬を生成する
function generateHorses() {
    const count = randomInt(8, 18);
    const usedNames = new Set();

    const horses = [];

    for (let i = 0; i < count; i++) {
        const speed = randomInt(65, 100);
        const stamina = randomInt(65, 100);
        const power = randomInt(65, 100);

        const ability =
            speed * 0.4 +
            stamina * 0.3 +
            power * 0.3;

        // 芝・ダート適性
        const turf = randomInt(60, 100);
        const dirt = randomInt(60, 100);

        // 馬場状態への適性
        const condition = {
            "良": randomInt(60, 100),
            "稍重": randomInt(60, 100),
            "重": randomInt(60, 100),
            "不良": randomInt(60, 100)
        };

        // 距離適性
        const distance = {
            short: randomInt(60, 100),
            mile: randomInt(60, 100),
            middle: randomInt(60, 100),
            long: randomInt(60, 100)
        };

        // 脚質
        const style = runningStyles[
            randomInt(0, runningStyles.length - 1)
        ];

        horses.push({
            number: i + 1,
            name: generateHorseName(usedNames),
            style: style,
            ability: ability,
            ground: {
                turf: turf,
                dirt: dirt
            },
        distance: distance,
        condition: condition
    });
    }

    return horses;
}

// レース距離に対応する適性を取得
function getDistanceAbility(horse) {
    const race = raceSchedule[currentRace - 1];
    const distance = race.distance;

    if (distance <= 1400) {
        return horse.distance.short;
    } else if (distance <= 1600) {
        return horse.distance.mile;
    } else if (distance <= 2200) {
        return horse.distance.middle;
    } else {
        return horse.distance.long;
    }
}

// 馬場適性を計算する
function getGroundAptitude(horse) {
    const race = raceSchedule[currentRace - 1];

    let surfaceAbility;

    // 芝の場合
    if (race.ground === "芝") {
        surfaceAbility = horse.ground.turf;

    // ダートの場合
    } else if (race.ground === "ダート") {
        surfaceAbility = horse.ground.dirt;

    // 芝・ダートの場合
    } else {
        surfaceAbility =
            (horse.ground.turf + horse.ground.dirt) / 2;
    }

    // 馬場状態への適性
    const conditionAbility =
        horse.condition[todayGroundCondition];

    // 芝・ダート適性と馬場状態適性の平均
    return (surfaceAbility + conditionAbility) / 2;
}

// 馬場適性を◎〇△×で表示する
function getGroundAptitudeMark(horse) {
    const aptitude = getGroundAptitude(horse);

    if (aptitude >= 90) return "◎";
    if (aptitude >= 80) return "〇";
    if (aptitude >= 70) return "△";

    return "×";
}

// 距離適性を◎〇△×で表示する
function getDistanceAptitudeMark(horse) {
    const aptitude = getDistanceAbility(horse);

    if (aptitude >= 90) return "◎";
    if (aptitude >= 80) return "〇";
    if (aptitude >= 70) return "△";

    return "×";
}

// レース条件を考慮した能力評価
function calculateRaceAbility(horse) {
    const race = raceSchedule[currentRace - 1];

    let surfaceAbility;

    if (race.ground === "芝") {
        surfaceAbility = horse.ground.turf;
    } else if (race.ground === "ダート") {
        surfaceAbility = horse.ground.dirt;
    } else {
        surfaceAbility =
            (horse.ground.turf + horse.ground.dirt) / 2;
    }

    const conditionAbility =
        horse.condition[todayGroundCondition];

    const distanceAbility = getDistanceAbility(horse);

    return horse.ability
        + (surfaceAbility - 80) * 0.30
        + (conditionAbility - 80) * 0.35
        + (distanceAbility - 80) * 0.35;
}

// オッズと人気を計算する
function calculateOdds(horses) {
    const weights = horses.map(horse =>
        Math.exp((calculateRaceAbility(horse) - 80) / 8)
    );

    const total = weights.reduce(
        (sum, value) => sum + value, 0
    );

    const ranked = horses.map((horse, index) => ({
        index,
        probability: weights[index] / total
    }));

    ranked.sort(
        (a, b) => b.probability - a.probability
    );

    return horses.map((horse, index) => ({
        ...horse,
        odds: Math.max(
            1.0,
            0.8 / (weights[index] / total)
        ),
        popularity: ranked.findIndex(
            item => item.index === index
        ) + 1
    }));
}

// 指定した着順になる確率を計算する
function calculateOrderProbability(numbers) {
    const weights = currentHorses.map(horse => ({
        number: horse.number,
        weight: Math.exp(
            (calculateRaceAbility(horse) - 80) / 8
        )
    }));

    let remainingWeight = weights.reduce(
        (sum, item) => sum + item.weight, 0
    );

    let probability = 1;

    for (const number of numbers) {
        const selected = weights.find(
            item => item.number === number
        );

        if (!selected || selected.weight > remainingWeight) {
            return 0;
        }

        probability *= selected.weight / remainingWeight;
        remainingWeight -= selected.weight;
    }

    return probability;
}

// 順列を作る
function getPermutations(numbers) {
    if (numbers.length <= 1) {
        return [numbers];
    }

    return numbers.flatMap((number, index) => {
        const remaining = numbers.filter(
            (_, i) => i !== index
        );

        return getPermutations(remaining).map(
            permutation => [number, ...permutation]
        );
    });
}

// 馬券の想定オッズを計算する
function calculateBetOdds(type, numbers) {
    let probability = 0;

    // 単勝
    if (type === "単勝") {
        const horse = currentHorses.find(
            horse => horse.number === numbers[0]
        );

        return horse ? horse.odds : 9999.9;
    }

    // 複勝：選んだ馬が3着以内に入る確率
    else if (type === "複勝") {
        const target = numbers[0];

        for (const first of currentHorses) {
            for (const second of currentHorses) {
                for (const third of currentHorses) {
                    const order = [
                        first.number,
                        second.number,
                        third.number
                    ];

                    if (new Set(order).size !== 3) continue;

                    if (order.includes(target)) {
                        probability += calculateOrderProbability(order);
                    }
                }
            }
        }
    }

    // 枠連：1着・2着の枠番を順不同で当てる
    else if (type === "枠連") {
        const frame1 = numbers[0];
        const frame2 = numbers[1];

        for (const first of currentHorses) {
            for (const second of currentHorses) {

                if (first.number === second.number) continue;

                const firstFrame = first.frame;
                const secondFrame = second.frame;

                const isMatch =
                    (firstFrame === frame1 && secondFrame === frame2) ||
                    (firstFrame === frame2 && secondFrame === frame1);

                if (isMatch) {
                    probability += calculateOrderProbability([
                        first.number,
                        second.number
                    ]);
                }
            }
        }
    }

    // ワイド：選んだ2頭が両方3着以内に入る確率
    else if (type === "ワイド") {
        const firstHorse = numbers[0];
        const secondHorse = numbers[1];

        for (const first of currentHorses) {
            for (const second of currentHorses) {
                for (const third of currentHorses) {
                    const order = [
                        first.number,
                        second.number,
                        third.number
                    ];

                    if (new Set(order).size !== 3) continue;

                    if (
                        order.includes(firstHorse) &&
                        order.includes(secondHorse)
                    ) {
                        probability += calculateOrderProbability(order);
                    }
                }
            }
        }
    }

    // 馬単・三連単：着順まで完全一致
    else if (type === "馬単" || type === "三連単") {
        probability = calculateOrderProbability(numbers);
    }

    // 馬連・三連複：着順を問わない
    else if (type === "馬連" || type === "三連複") {
        const permutations = getPermutations(numbers);

        for (const order of permutations) {
            probability += calculateOrderProbability(order);
        }
    }

    if (probability <= 0) {
        return 9999.9;
    }

    // 払戻率80%を想定
    return Math.max(1.0, 0.8 / probability);
}

// 競馬場をランダムに決める
function generateRacecourse() {
    return racecourses[
        randomInt(0, racecourses.length - 1)
    ];
}


// 馬番と出走頭数から枠番を計算する
function calculateFrameNumber(horseNumber, horseCount) {

    // 6～8頭の場合は1頭ずつ1枠
    if (horseCount <= 8) {
        return horseNumber;
    }

    // 1枠あたりの基本頭数
    const base = Math.floor(horseCount / 8);

    // 余った馬の頭数
    const remainder = horseCount % 8;

    // 余った馬を割り当て始める枠
    const extraStart = 8 - remainder + 1;

    let currentHorse = 0;

    // 1枠から8枠まで順番に調べる
    for (let frame = 1; frame <= 8; frame++) {

        const frameSize =
            base + (frame >= extraStart ? 1 : 0);

        currentHorse += frameSize;

        if (horseNumber <= currentHorse) {
            return frame;
        }
    }

    return null;
}

function calculateUpsetOdds(type, numbers) {

    const oddsRanges = {
        "単勝": [1000, 600],
        "複勝": [50, 200],
        "ワイド": [800, 2000],
        "枠連": [500, 1500],
        "馬連": [1000, 8000],
        "馬単": [8000, 18000],

        // 100円あたりの最大払戻金からオッズを設定
        "三連複": [10000, 80000],
        "三連単": [75000, 150000]
    };

    const range = oddsRanges[type];

    if (!range) {
        return calculateBetOdds(type, numbers);
    }

    const normalOdds = calculateBetOdds(type, numbers);

    const score = Math.max(
        0,
        Math.min(
            1,
            Math.log10(Math.max(1, normalOdds)) / 4
        )
    );

    const odds =
        range[0] + (range[1] - range[0]) * score;

    return Math.round(odds * 10) / 10;
}

//枠番を表示する
function getFrameHTML(frame) {
    return `
        <span class="frame-number frame-${frame}">
            ${frame}
        </span>
    `;
}


// 出走馬を表示する
function displayHorses(horses) {
    const horseList =
        document.getElementById("horse-list");

    horseList.innerHTML = "";

    // 元の配列を変更しないようにコピーする
    let sortedHorses = [...horses];

    // 並び順を変更
    if (horseSortMode === "odds") {
        sortedHorses.sort((a, b) => a.odds - b.odds);
    } else {
        sortedHorses.sort((a, b) => a.number - b.number);
    }

    sortedHorses.forEach(horse => {
        const div = document.createElement("div");

        div.className = "horse";

        div.innerHTML = `
            <div class="horse-frame frame-${horse.frame}">
                ${horse.frame}
            </div>

            <div class="horse-number">
                ${horse.number}
            </div>

            <div class="horse-name">
                ${horse.name}
                <div class="horse-info">
                    脚質：${horse.style}
                </div>
                <div class="horse-info">
                    馬場適性：
                    <strong>${getGroundAptitudeMark(horse)}</strong>
                </div>
            </div>

            <div class="horse-info">
                ${horse.popularity}番人気
                <div class="odds">
                    単勝 ${horse.odds.toFixed(1)}倍
                </div>
            </div>

            <div class="horse-distance">
            距離適性：
            <strong>${getDistanceAptitudeMark(horse)}</strong>
            </div>
        `;

        horseList.appendChild(div);
    });
}


// 出走表の並び順を変更する
function changeHorseSort() {
    horseSortMode = document.getElementById("horse-sort").value;

    displayHorses(currentHorses);
}

// 馬券の種類ごとの選択頭数
function getBetHorseCount(type) {
    if (type === "単勝" || type === "複勝") return 1;
    if (
        type === "枠連" ||
        type === "馬連" ||
        type === "馬単" ||
        type === "ワイド"
    ) return 2;

    return 3;
}



// 馬券の選択欄を更新する
function updateBetInputs() {
    const type = document.getElementById("bet-type").value;
    const methodSelect = document.getElementById("bet-method");
    const container = document.getElementById("bet-horse-inputs");

    container.innerHTML = "";

    // 単勝・複勝は買い方の欄を非表示にする
    const methodSection = document.querySelector(
     ".bet-method-section"
    );
    
    if (type === "単勝" || type === "複勝") {
        methodSelect.value = "formation";
        methodSection.hidden = true;
    } else {
        methodSection.hidden = false;
    }

    const currentMethod = methodSelect.value;

    // 枠連は枠番、それ以外は馬番
    let values;

    if (type === "枠連") {
        values = [
            ...new Set(currentHorses.map(horse => horse.frame))
        ].sort((a, b) => a - b);
    } else {
        values = currentHorses.map(horse => horse.number);
    }

    // 選択欄を作成する共通処理
    function createGroup(groupName, single = false) {
        const section = document.createElement("div");
        section.className = "bet-choice-group";

        const heading = document.createElement("h4");
        heading.textContent = groupName;
        section.appendChild(heading);

        const choices = document.createElement("div");
        choices.className = "bet-choice-list";

        values.forEach(number => {
            const label = document.createElement("label");

            const checkbox = document.createElement("input");

            checkbox.type = single ? "radio" : "checkbox";
            checkbox.name = single
                ? `bet-axis-${groupName}`
                : "";

            checkbox.value = number;
            checkbox.className = "bet-choice";

            checkbox.addEventListener(
                "change",
                updateBetOddsPreview
            );

            label.appendChild(checkbox);

            // 馬番または枠番を表示
            const numberText = document.createElement("span");

            numberText.textContent =
                type === "枠連"
                    ? `${number}枠`
                    : `${number}番`;

            label.appendChild(numberText);

            // 枠連以外は単勝オッズを表示
            if (type !== "枠連") {
                const horse = currentHorses.find(
                    horse => horse.number === number
                );

                if (horse) {
                    const odds = document.createElement("span");

                    odds.className = "bet-choice-odds";
                    odds.textContent =
                        `${horse.odds.toFixed(1)}倍`;

                    label.appendChild(odds);
                }
            }

            choices.appendChild(label);
        });

        section.appendChild(choices);
        container.appendChild(section);
    }

    // フォーメーション
    if (currentMethod === "formation") {
        let groups = [];

        if (type === "単勝") {
            groups = ["1着"];
        } else if (type === "複勝") {
            groups = ["1～3着"];
        } else if (
            type === "枠連" ||
            type === "馬連" ||
            type === "ワイド"
        ) {
            groups = ["1頭目", "2頭目"];
        } else if (type === "馬単") {
            groups = ["1着", "2着"];
        } else if (type === "三連複") {
            groups = ["1頭目", "2頭目", "3頭目"];
        } else if (type === "三連単") {
            groups = ["1着", "2着", "3着"];
        }

        groups.forEach(group => createGroup(group));
    }

    // ボックス
    else if (currentMethod === "box") {
        createGroup("選択する馬");
    }

    // ながし
    else if (currentMethod === "nagashi") {
        const pattern = document.createElement("select");
        pattern.id = "bet-nagashi-pattern";

        let options = [];

        if (
            type === "枠連" ||
            type === "馬連" ||
            type === "ワイド"
        ) {
            options = [
                ["axis1", "軸1頭ながし"]
            ];
        } else if (type === "馬単") {
            options = [
                ["first", "1着固定"],
                ["second", "2着固定"]
            ];
        } else if (type === "三連複") {
            options = [
                ["axis1", "軸1頭ながし"],
                ["axis2", "軸2頭ながし"]
            ];
        } else if (type === "三連単") {
            options = [
                ["first", "1着固定"],
                ["second", "2着固定"],
                ["third", "3着固定"],
                ["first-second", "1・2着固定"],
                ["first-third", "1・3着固定"],
                ["second-third", "2・3着固定"]
            ];
        }

        options.forEach(([value, text]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            pattern.appendChild(option);
        });

        container.appendChild(pattern);

        // 馬単・三連単だけマルチの選択欄を表示
        if (type === "馬単" || type === "三連単") {
            const multiLabel = document.createElement("label");
            multiLabel.className = "bet-multi-option";

            const multiCheckbox = document.createElement("input");
            multiCheckbox.type = "checkbox";
            multiCheckbox.id = "bet-nagashi-multi";

            multiCheckbox.addEventListener(
                "change",
                updateBetOddsPreview
            );

            multiLabel.appendChild(multiCheckbox);
            multiLabel.appendChild(
                document.createTextNode(" マルチ")
            );

            container.appendChild(multiLabel);
        }

        function updateNagashiGroups() {
            // 以前の選択欄を削除
            container.querySelectorAll(".bet-choice-group")
                .forEach(group => group.remove());

            const selected = pattern.value;

            if (
                type === "枠連" ||
                type === "馬連" ||
                type === "ワイド"
            ) {
                createGroup("軸", true);
                createGroup("相手");

            } else if (type === "馬単") {
                if (selected === "first") {
                    createGroup("1着固定", true);
                    createGroup("2着の相手");
                } else {
                    createGroup("2着固定", true);
                    createGroup("1着の相手");
                }

            } else if (type === "三連複") {
                if (selected === "axis1") {
                    createGroup("軸", true);
                    createGroup("相手");
                } else {
                    createGroup("軸1頭目", true);
                    createGroup("軸2頭目", true);
                    createGroup("相手");
                }

            } else if (type === "三連単") {
                const groupNames = {
                    first: ["1着固定", "相手"],
                    second: ["2着固定", "相手"],
                    third: ["3着固定", "相手"],
                    "first-second": [
                        "1着固定", "2着固定", "相手"
                    ],
                    "first-third": [
                        "1着固定", "3着固定", "相手"
                    ],
                    "second-third": [
                        "2着固定", "3着固定", "相手"
                    ]
                };

                const names = groupNames[selected];

                names.forEach((name, index) => {
                    // 最後のグループ以外は軸なので1頭限定
                    createGroup(
                        name,
                        index !== names.length - 1
                    );
                });
            }

            updateBetOddsPreview();
        }

        pattern.addEventListener(
            "change",
            updateNagashiGroups
        );

        updateNagashiGroups();
    }

    updateBetOddsPreview();
}

 // 選択内容から買い目の組み合わせを生成する
function generateBetCombinations() {
    const type = document.getElementById("bet-type").value;
    const method = document.getElementById("bet-method").value;

    const groups = [
        ...document.querySelectorAll(".bet-choice-group")
    ];

    const selectedGroups = groups.map(group =>
        [...group.querySelectorAll(".bet-choice:checked")]
            .map(checkbox => Number(checkbox.value))
    );

    const first = selectedGroups[0] || [];
    const second = selectedGroups[1] || [];
    const third = selectedGroups[2] || [];

    const combinations = [];
    const used = new Set();

    // マルチが選択されているか
    const multiCheckbox = document.getElementById(
        "bet-nagashi-multi"
    );

    const isMulti =
        method === "nagashi" &&
        (type === "馬単" || type === "三連単") &&
        multiCheckbox &&
        multiCheckbox.checked;

    function addCombination(numbers, unordered = false) {
        const result = unordered
            ? [...numbers].sort((a, b) => a - b)
            : [...numbers];

        const key = result.join("-");

        if (!used.has(key)) {
            used.add(key);
            combinations.push(result);
        }
    }

    // 3頭の着順を入れ替えた全パターンを追加
    function addAllPermutations(numbers) {
        numbers.forEach(a => {
            numbers.forEach(b => {
                numbers.forEach(c => {
                    if (a !== b && a !== c && b !== c) {
                        addCombination([a, b, c]);
                    }
                });
            });
        });
    }

    function validFramePair(frame1, frame2) {
        if (frame1 !== frame2) return true;

        return currentHorses.filter(
            horse => horse.frame === frame1
        ).length >= 2;
    }

    function makePairs(numbers) {
        for (let i = 0; i < numbers.length; i++) {
            for (let j = i + 1; j < numbers.length; j++) {
                addCombination([numbers[i], numbers[j]], true);
            }
        }
    }

    function makeOrderedPairs(numbers) {
        numbers.forEach(a => {
            numbers.forEach(b => {
                if (a !== b) addCombination([a, b]);
            });
        });
    }

    function makeTriples(numbers) {
        for (let i = 0; i < numbers.length; i++) {
            for (let j = i + 1; j < numbers.length; j++) {
                for (let k = j + 1; k < numbers.length; k++) {
                    addCombination(
                        [numbers[i], numbers[j], numbers[k]],
                        true
                    );
                }
            }
        }
    }

    function makeOrderedTriples(numbers) {
        numbers.forEach(a => {
            numbers.forEach(b => {
                numbers.forEach(c => {
                    if (a !== b && a !== c && b !== c) {
                        addCombination([a, b, c]);
                    }
                });
            });
        });
    }

    // フォーメーション
    if (method === "formation") {
        if (type === "単勝" || type === "複勝") {
            first.forEach(number => addCombination([number]));

        } else if (type === "枠連") {
            first.forEach(frame1 => {
                second.forEach(frame2 => {
                    if (validFramePair(frame1, frame2)) {
                        addCombination([frame1, frame2], true);
                    }
                });
            });

        } else if (type === "馬連" || type === "ワイド") {
            first.forEach(a => {
                second.forEach(b => {
                    if (a !== b) {
                        addCombination([a, b], true);
                    }
                });
            });

        } else if (type === "馬単") {
            first.forEach(a => {
                second.forEach(b => {
                    if (a !== b) addCombination([a, b]);
                });
            });

        } else if (type === "三連複") {
            first.forEach(a => {
                second.forEach(b => {
                    third.forEach(c => {
                        if (a !== b && a !== c && b !== c) {
                            addCombination([a, b, c], true);
                        }
                    });
                });
            });

        } else if (type === "三連単") {
            first.forEach(a => {
                second.forEach(b => {
                    third.forEach(c => {
                        if (a !== b && a !== c && b !== c) {
                            addCombination([a, b, c]);
                        }
                    });
                });
            });
        }
    }

    // ボックス
    else if (method === "box") {
        const selected = first;

        if (type === "枠連") {
            for (let i = 0; i < selected.length; i++) {
                for (let j = i; j < selected.length; j++) {
                    const frame1 = selected[i];
                    const frame2 = selected[j];

                    if (validFramePair(frame1, frame2)) {
                        addCombination([frame1, frame2], true);
                    }
                }
            }

        } else if (type === "馬連" || type === "ワイド") {
            makePairs(selected);

        } else if (type === "馬単") {
            makeOrderedPairs(selected);

        } else if (type === "三連複") {
            makeTriples(selected);

        } else if (type === "三連単") {
            makeOrderedTriples(selected);
        }
    }

    // ながし
    else if (method === "nagashi") {
        const pattern = document.getElementById(
            "bet-nagashi-pattern"
        ).value;

        if (
            type === "枠連" ||
            type === "馬連" ||
            type === "ワイド"
        ) {
            first.forEach(axis => {
                second.forEach(opponent => {
                    if (axis === opponent) {
                        if (
                            type !== "枠連" ||
                            !validFramePair(axis, opponent)
                        ) return;
                    }

                    addCombination([axis, opponent], true);
                });
            });

        } else if (type === "馬単") {
            first.forEach(axis => {
                second.forEach(opponent => {
                    if (axis === opponent) return;

                    if (pattern === "first") {
                        addCombination([axis, opponent]);

                        if (isMulti) {
                            addCombination([opponent, axis]);
                        }
                    } else {
                        addCombination([opponent, axis]);

                        if (isMulti) {
                            addCombination([axis, opponent]);
                        }
                    }
                });
            });

        } else if (type === "三連複") {
            if (pattern === "axis1") {
                first.forEach(axis => {
                    const opponents = second.filter(
                        number => number !== axis
                    );

                    for (let i = 0; i < opponents.length; i++) {
                        for (let j = i + 1; j < opponents.length; j++) {
                            addCombination(
                                [axis, opponents[i], opponents[j]],
                                true
                            );
                        }
                    }
                });

            } else if (pattern === "axis2") {
                first.forEach(axis1 => {
                    second.forEach(axis2 => {
                        if (axis1 === axis2) return;

                        third.forEach(opponent => {
                            if (
                                opponent === axis1 ||
                                opponent === axis2
                            ) return;

                            addCombination(
                                [axis1, axis2, opponent],
                                true
                            );
                        });
                    });
                });
            }

        } else if (type === "三連単") {
            if (
                pattern === "first" ||
                pattern === "second" ||
                pattern === "third"
            ) {
                const fixedPosition = {
                    first: 0,
                    second: 1,
                    third: 2
                }[pattern];

                first.forEach(axis => {
                    const opponents = second.filter(
                        number => number !== axis
                    );

                    for (let i = 0; i < opponents.length; i++) {
                        for (let j = 0; j < opponents.length; j++) {
                            if (i === j) continue;

                            if (isMulti) {
                                addAllPermutations([
                                    axis,
                                    opponents[i],
                                    opponents[j]
                                ]);
                            } else {
                                const result = [];
                                result[fixedPosition] = axis;

                                const otherPositions = [0, 1, 2].filter(
                                    position => position !== fixedPosition
                                );

                                result[otherPositions[0]] = opponents[i];
                                result[otherPositions[1]] = opponents[j];

                                addCombination(result);
                            }
                        }
                    }
                });

            } else if (
                pattern === "first-second" ||
                pattern === "first-third" ||
                pattern === "second-third"
            ) {
                const fixedPositions = {
                    "first-second": [0, 1],
                    "first-third": [0, 2],
                    "second-third": [1, 2]
                }[pattern];

                first.forEach(axis1 => {
                    second.forEach(axis2 => {
                        if (axis1 === axis2) return;

                        third.forEach(opponent => {
                            if (
                                opponent === axis1 ||
                                opponent === axis2
                            ) return;

                            if (isMulti) {
                                addAllPermutations([
                                    axis1,
                                    axis2,
                                    opponent
                                ]);
                            } else {
                                const result = [];

                                result[fixedPositions[0]] = axis1;
                                result[fixedPositions[1]] = axis2;

                                const remainingPosition = [0, 1, 2].find(
                                    position =>
                                        !fixedPositions.includes(position)
                                );

                                result[remainingPosition] = opponent;

                                addCombination(result);
                            }
                        });
                    });
                });
            }
        }
    }

    return combinations;
}

// 選択内容と購入金額を確認する
function updateBetOddsPreview() {
    const type = document.getElementById("bet-type").value;

    const groups = [
        ...document.querySelectorAll(".bet-choice-group")
    ];

    const summary = document.getElementById("bet-summary");

    summary.innerHTML = groups.map(group => {
        const heading = group.querySelector("h4").textContent;

        const count = group.querySelectorAll(
            ".bet-choice:checked"
        ).length;

        const unit = type === "枠連" ? "枠" : "頭";

        return `${heading}：${count}${unit}`;
    }).join("<br>");

    // 買い目の組み合わせ数
    const combinations = generateBetCombinations();

    // 1点あたりの購入金額
    const amount = Number(
        document.getElementById("bet-amount").value
    );

    const total = combinations.length * amount;

    document.getElementById("bet-odds").textContent =
        `買い目：${combinations.length}点 / 合計購入金額：${total.toLocaleString()}円`;
}

// 重み付き抽選で1頭を選ぶ
function drawWeightedHorse(horses) {
    const weights = horses.map(horse => ({
        horse: horse,
        weight: Math.exp(
            (calculateRaceAbility(horse) - 80) / 5
        )
    }));

    const totalWeight = weights.reduce(
        (sum, item) => sum + item.weight, 0
    );

    let random = Math.random() * totalWeight;

    for (const item of weights) {
        random -= item.weight;

        if (random < 0) {
            return item.horse;
        }
    }

    return weights[weights.length - 1].horse;
}

// 全馬の着順を決める
function simulateFinishOrder(horses, isBigUpset = false) {

    // 通常レース
    if (!isBigUpset) {
        const remaining = [...horses];
        const results = [];

        while (remaining.length > 0) {
            const selected = drawWeightedHorse(remaining);

            results.push(selected);

            const index = remaining.findIndex(
                horse => horse.number === selected.number
            );

            remaining.splice(index, 1);
        }

        return results;
    }

    // 大波乱レース
    // オッズが高い順に並べる
    const sortedByOdds = [...horses].sort(
        (a, b) => b.odds - a.odds
    );

    // 上位40%程度の人気薄を候補にする
    const outsiderCount = Math.min(
        horses.length,
        Math.max(3, Math.ceil(horses.length * 0.4))
    );

    const outsiderPool = sortedByOdds.slice(
        0,
        outsiderCount
    );

    const remainingOutsiders = [...outsiderPool];
    const results = [];

    // 人気薄から上位3頭を抽選
    while (
        results.length < 3 &&
        remainingOutsiders.length > 0
    ) {
        const selected = drawWeightedHorse(
            remainingOutsiders
        );

        results.push(selected);

        const index = remainingOutsiders.findIndex(
            horse => horse.number === selected.number
        );

        remainingOutsiders.splice(index, 1);
    }

    // 残りの馬を通常どおり抽選
    const selectedNumbers = new Set(
        results.map(horse => horse.number)
    );

    const remaining = horses.filter(
        horse => !selectedNumbers.has(horse.number)
    );

    while (remaining.length > 0) {
        const selected = drawWeightedHorse(remaining);

        results.push(selected);

        const index = remaining.findIndex(
            horse => horse.number === selected.number
        );

        remaining.splice(index, 1);
    }

    return results;
}

// 馬券を購入する
function addBet() {
    if (raceStarted) {
        alert("レース開始後は購入できません。");
        return;
    }

    const type = document.getElementById("bet-type").value;
    const method = document.getElementById("bet-method").value;

    const combinations = generateBetCombinations();

    if (combinations.length === 0) {
        alert("馬番を選択してください。");
        return;
    }

    const amount = Number(
        document.getElementById("bet-amount").value
    );

    if (
        !Number.isInteger(amount) ||
        amount < 100 ||
        amount % 100 !== 0
    ) {
        alert("購入金額は100円以上、100円単位で入力してください。");
        return;
    }

    const totalAmount = combinations.length * amount;

    if (totalAmount > money) {
        alert(
            `所持金が足りません。\n` +
            `必要金額：${totalAmount.toLocaleString()}円\n` +
            `所持金：${money.toLocaleString()}円`
        );
        return;
    }

    // 選択した馬番をグループごとに保存
    const groups = [
        ...document.querySelectorAll(".bet-choice-group")
    ];

    const selectedGroups = groups.map(group =>
        [...group.querySelectorAll(".bet-choice:checked")]
            .map(checkbox => Number(checkbox.value))
    );

    // グループ名を保存
    const groupLabels = groups.map(group =>
        group.querySelector("h4").textContent
    );

    // ながしの固定位置を保存
    let patternLabel = "";

    if (method === "nagashi") {
        const pattern = document.getElementById(
            "bet-nagashi-pattern"
        );

        if (pattern) {
            patternLabel =
                pattern.options[pattern.selectedIndex].textContent;
        }
    }

    // マルチが選択されているか
    const multiCheckbox = document.getElementById(
        "bet-nagashi-multi"
    );

    const isMulti =
        method === "nagashi" &&
        multiCheckbox &&
        multiCheckbox.checked;

    // 購入操作ごとに識別番号を付ける
    const purchaseId = Date.now() + Math.random();

    // 購入内容を保存
    const purchaseInfo = {
        method: method,
        patternLabel: patternLabel,
        isMulti: isMulti,
        selectedGroups: selectedGroups,
        groupLabels: groupLabels
    };

    // 従来どおり、買い目は1点ずつ保存する
    combinations.forEach(numbers => {
        const odds = Math.round(
            calculateBetOdds(type, numbers) * 10
        ) / 10;

        currentBets.push({
            type: type,
            numbers: numbers,
            amount: amount,
            odds: odds,

            // 追加情報
            purchaseId: purchaseId,
            purchaseInfo: purchaseInfo
        });
    });

    money -= totalAmount;
    totalBetAmount += totalAmount;

    updateMoneyDisplay();
    displayBets();

    document.getElementById("bet-amount").value = 100;

    updateBetOddsPreview();
}

// 購入内容をコンパクトな文字列にする
function formatBetPurchaseInfo(info, type) {
    if (!info) {
        return "";
    }

    const unit = type === "枠連" ? "枠" : "";

    const groupTexts = info.selectedGroups
        .filter(group => group.length > 0)
        .map(group =>
            group.map(number => `${number}${unit}`).join("・")
        );

    const numberText = groupTexts.join("－");

    const methodNames = {
        formation: "フォーメーション",
        box: "ボックス",
        nagashi: "ながし"
    };

    const methodText =
        methodNames[info.method] || "";

    const patternText = info.patternLabel
        ? `　${info.patternLabel}`
        : "";

    const multiText = info.isMulti
        ? "　マルチ"
        : "";

    return {
        heading:
            `${type}　${methodText}${patternText}${multiText}`,
        numbers: numberText
    };
}

// 所持金の表示を更新する
function updateMoneyDisplay() {
    const moneyText =
        `${money.toLocaleString("ja-JP")}円`;

    // 画面上部の所持金
    const topMoney = document.getElementById("money");

    if (topMoney) {
        topMoney.textContent = moneyText;
    }

    // 購入馬券一覧の下部の所持金
    const bottomMoney =
        document.getElementById("money-display-bottom");

    if (bottomMoney) {
        bottomMoney.textContent =
            `所持金：${moneyText}`;
    }
}

// 購入した馬券を表示する
function displayBets() {
    const list = document.getElementById("bet-list");

    if (currentBets.length === 0) {
        list.textContent = "まだ馬券を購入していません。";
        return;
    }

    list.innerHTML = "";

    let total = 0;

    // 購入操作ごとにグループ分け
    const purchaseGroups = new Map();

    currentBets.forEach((bet, index) => {
        const key =
            bet.purchaseId !== undefined
                ? bet.purchaseId
                : `old-${index}`;

        if (!purchaseGroups.has(key)) {
            purchaseGroups.set(key, []);
        }

        purchaseGroups.get(key).push(bet);

        total += bet.amount;
    });

    let purchaseNumber = 1;

    // 購入操作ごとに表示
    purchaseGroups.forEach(bets => {
        const firstBet = bets[0];

        const div = document.createElement("div");
        div.className = "bet-ticket";

        const pointCount = bets.length;
        const amountPerPoint = firstBet.amount;
        const groupTotal = pointCount * amountPerPoint;

        // 購入内容の表示
        if (firstBet.purchaseInfo) {

            const formatted = formatBetPurchaseInfo(
                firstBet.purchaseInfo,
                firstBet.type
            );

            // 単勝・複勝は購入方法を表示しない
            const heading =
                firstBet.type === "単勝" ||
                firstBet.type === "複勝"
                    ? firstBet.type
                    : formatted.heading;

            div.innerHTML = `
                <div>
                    ${purchaseNumber}. ${heading}
                </div>
                <div>
                    ${formatted.numbers}
                </div>
                <div>
                    ${pointCount}点 ×
                    ${amountPerPoint.toLocaleString("ja-JP")}円
                    ＝
                    ${groupTotal.toLocaleString("ja-JP")}円
                </div>
            `;

        } else {
            // 以前の形式で保存された馬券への対応
            const numberLabel =
                firstBet.type === "枠連" ? "枠" : "番";

            const separator =
                firstBet.type === "馬単" ||
                firstBet.type === "三連単"
                    ? " → "
                    : " - ";

            const orderText = firstBet.numbers
                .map(number => `${number}${numberLabel}`)
                .join(separator);

            div.textContent =
                `${purchaseNumber}. ${firstBet.type}：${orderText} / ` +
                `${firstBet.amount.toLocaleString("ja-JP")}円`;
        }

        list.appendChild(div);

        purchaseNumber++;
    });

    // 購入合計
    const totalDiv = document.createElement("div");

    totalDiv.className = "bet-total";

    totalDiv.textContent =
        `購入合計：${total.toLocaleString("ja-JP")}円`;

    list.appendChild(totalDiv);
}

// レース画面を更新する
function initializeRace() {
    
// 出走馬を生成
const horses = generateHorses();

// 各馬に枠番を設定
horses.forEach(horse => {
    horse.frame = calculateFrameNumber(
        horse.number,
        horses.length
    );
});

// オッズを計算
currentHorses = calculateOdds(horses);

    // 新しいレースの準備
    currentBets = [];
    raceStarted = false;

    updateMoneyDisplay();

    // 現在のレースのスケジュールを取得
    const race = raceSchedule[currentRace - 1];

    // 競馬場をランダムに決定
    const racecourse = todayRacecourse;

    document.getElementById("racecourse-name").textContent =
        racecourse;

    // 競馬場名を短縮
    const courseShortName = racecourse.replace("競馬場", "");

    // レース名を決定
    let raceName;

    if (race.name === "新馬戦") {
        raceName = `メイクデビュー${courseShortName}`;
    } else if (race.name === "グランドジャンプ") {
        raceName = `${courseShortName}グランドジャンプ（J・GI）`;
    } else {
        raceName = race.name;
    }

    document.getElementById("race-name").textContent =
        raceName;

    // レース情報を表示
    document.getElementById("race-info").textContent =
    `${race.distance}m / ${race.ground} / 天気：${todayWeather} / 馬場状態：${todayGroundCondition}`;

    // レース数を表示
    document.getElementById("race-count").textContent =
        `第${currentRace}レース / ${TOTAL_RACES}`;

    // 出走表を表示
    displayHorses(currentHorses);

    // 買い方をフォーメーションに戻す
    document.getElementById("bet-method").value = "formation";
    
    // 馬券の選択欄を更新
    updateBetInputs();
    displayBets();

    document.getElementById("bet-section").style.display =
        "block";
    document.getElementById("race-preparation").style.display =
    "block";
}

// レースを実行する
function startRace() {
    if (raceStarted) return;

    raceStarted = true;

    // 1%の確率で大波乱イベント発生
    isBigUpsetRace = Math.random() < 0.01;
    //isBigUpsetRace = true

    // 着順を最初に決定しておく
    const results = simulateFinishOrder(
        currentHorses,
        isBigUpsetRace
    );

    // 出走表と馬券購入欄を隠す
    document.getElementById("race-preparation").style.display =
        "none";

    // 結果画面はまだ表示しない
    document.getElementById("result-section").style.display =
        "none";

    // アニメーション画面を表示
    document.getElementById("race-animation-section").style.display =
        "block";

    window.scrollTo(0, 0);

    // アニメーション開始
    startRaceAnimation(results);
}


// レースアニメーションを開始する
function startRaceAnimation(results) {
    const container =
        document.getElementById("animation-horses");

    const ranking =
        document.getElementById("animation-ranking");

    container.innerHTML = "";

    // 芝・ダートに応じて地面の色を変更
    const race = raceSchedule[currentRace - 1];
    const track = document.getElementById("race-track");

    if (race.ground === "ダート") {
        track.style.background = `
            repeating-linear-gradient(
                to bottom,
                #b58b59 0px,
                #b58b59 35px,
                #a47a4c 35px,
                #a47a4c 70px
            )
        `;
    } else {
        track.style.background = `
            repeating-linear-gradient(
                to bottom,
                #278b43 0px,
                #278b43 35px,
                #217b3a 35px,
                #217b3a 70px
            )
        `;
    }

    ranking.textContent = "レース開始！";

    const duration = 18000;
    const startTime = performance.now();

    // レース結果へ進むボタン
    const skipButton =
        document.getElementById("skip-race-button");

    let animationFinished = false;

    skipButton.onclick = function() {
        if (animationFinished) return;

        animationFinished = true;
        finishRaceAnimation(results);
    };

    // 馬ごとのアニメーション情報
    const animationHorses = currentHorses.map(
        (horse, index) => {

            const resultIndex = results.findIndex(
                result => result.number === horse.number
            );

            const element = document.createElement("div");
            element.className = "animated-horse";

            element.style.width = "70px";

            const frameColors = {
                1: ["#FFFFFF", "#222222"],
                2: ["#222222", "#FFFFFF"],
                3: ["#E53935", "#FFFFFF"],
                4: ["#2196F3", "#FFFFFF"],
                5: ["#FDD835", "#222222"],
                6: ["#2E9D50", "#FFFFFF"],
                7: ["#F28C28", "#222222"],
                8: ["#F48FB1", "#222222"]
            };

            const [backgroundColor, textColor] =
                frameColors[horse.frame] || frameColors[1];

            element.innerHTML = `
                <span class="horse-number"
                    style="background:${backgroundColor}; color:${textColor};">
                    ${horse.number}
                </span>
                <span class="horse-icon">🐎</span>
            `;

            container.appendChild(element);

            // 競馬場の高さに合わせて縦位置を決める
            const trackHeight = container.clientHeight;
            const horseHeight = element.offsetHeight || 25;

            const availableHeight =
                Math.max(0, trackHeight - horseHeight);

            const topPosition =
                currentHorses.length <= 1
                    ? 0
                    : index * availableHeight /
                        (currentHorses.length - 1);

            element.style.top = `${topPosition}px`;

            // 実際の着順に応じてゴール時間を設定
            const finishTime =
                14000 + resultIndex * 180;

            return {
                horse: horse,
                element: element,
                resultIndex: resultIndex,
                finishTime: finishTime
            };
        }
    );

    // アニメーションを更新
    function animate(now) {

        if (animationFinished) return;

        const elapsed = Math.min(
            now - startTime,
            duration
        );

        // 馬ごとの位置を更新
        animationHorses.forEach(item => {

            // 実際の着順に従って進行度を計算
            const p = Math.min(
                elapsed / item.finishTime,
                1
            );

            // 馬の幅を考慮して横位置を計算
            const trackWidth = container.clientWidth;
            const horseWidth = item.element.offsetWidth;

            const maxLeft = Math.max(
                0,
                trackWidth - horseWidth
            );

            const position =
                2 + p * Math.max(0, maxLeft - 2);

            item.element.style.left = `${position}px`;
        });

        // 現在の位置順に並べる
        const liveRanking = [...animationHorses].sort(
            (a, b) => {

                const aPosition =
                    parseFloat(a.element.style.left);

                const bPosition =
                    parseFloat(b.element.style.left);

                // 同じ位置なら実際の着順を優先
                return (
                    bPosition - aPosition ||
                    a.resultIndex - b.resultIndex
                );
            }
        );

        ranking.textContent =
            "現在の先頭集団：" +
            liveRanking.slice(0, 5)
                .map((item, index) =>
                    `${index + 1}位 ${item.horse.number}番`
                )
                .join("　");

        // 18秒経過したら終了
        if (elapsed < duration) {
            requestAnimationFrame(animate);

        } else {
            animationFinished = true;
            finishRaceAnimation(results);
        }
    }

    requestAnimationFrame(animate);
}

// レースアニメーション終了後の処理
function finishRaceAnimation(results) {

    document.getElementById("race-animation-section").style.display =
        "none";

    // 確定着順を表示
    displayResults(results);

    // 馬券の払戻額を計算・表示
    displayPayouts(results);

    // 全馬券の払戻額を計算・表示
    displayOfficialPayouts(results);

    // レース結果画面では上部の所持金を隠す
    document.querySelector(".status-panel").classList.add("hide-money");

    // 結果画面を表示
    document.getElementById("result-section").style.display =
        "block";

    window.scrollTo(0, 0);

    // 次のレースボタン
    const nextButton =
        document.getElementById("next-button");

    // 所持金が100円以下、または最終レースなら最終結果へ
    if (money <= 100 || currentRace === TOTAL_RACES) {

        nextButton.textContent = "最終結果を見る";
        nextButton.onclick = showFinalResult;

    } else {

        nextButton.textContent = "次のレースへ";
        nextButton.onclick = nextRace;

    }
}

// レース結果を表示する
function displayResults(results) {
    const resultList =
        document.getElementById("result-list");

    resultList.innerHTML = "";

    results.forEach((horse, index) => {
        const div = document.createElement("div");

        div.className = "result-horse";

        div.innerHTML = `
            <div class="result-rank">
                ${index + 1}着
            </div>

            <div class="result-name">
                ${horse.number}番 ${horse.name}
            </div>

            <div>
                ${horse.odds.toFixed(1)}倍
            </div>
        `;

        resultList.appendChild(div);
    });
}

// 馬券の的中判定と払戻額を計算
function calculateTicketPayout(bet, resultOrder) {

    const top3 = resultOrder.slice(0, 3).map(
        horse => horse.number
    );

    let hit = false;

    if (bet.type === "単勝") {
        hit = bet.numbers[0] === top3[0];

    } else if (bet.type === "複勝") {
        hit = top3.includes(bet.numbers[0]);

    } else if (bet.type === "枠連") {
        const firstFrame = resultOrder[0].frame;
        const secondFrame = resultOrder[1].frame;

        hit =
            (bet.numbers[0] === firstFrame &&
             bet.numbers[1] === secondFrame) ||
            (bet.numbers[0] === secondFrame &&
             bet.numbers[1] === firstFrame);

    } else if (bet.type === "馬連") {
        hit = [...bet.numbers].sort((a, b) => a - b)
            .join(",") === top3.slice(0, 2)
            .sort((a, b) => a - b).join(",");

    } else if (bet.type === "馬単") {
        hit =
            bet.numbers[0] === top3[0] &&
            bet.numbers[1] === top3[1];

    } else if (bet.type === "ワイド") {
        hit =
            top3.includes(bet.numbers[0]) &&
            top3.includes(bet.numbers[1]);

    } else if (bet.type === "三連複") {
        hit = [...bet.numbers].sort((a, b) => a - b)
            .join(",") === [...top3].sort((a, b) => a - b)
            .join(",");

    } else if (bet.type === "三連単") {
        hit = bet.numbers.join(",") === top3.join(",");
    }

    // 通常は購入時のオッズを使用
    let odds = bet.odds;

    // 大波乱で的中した場合は特別オッズに変更
    if (isBigUpsetRace && hit) {
        odds = calculateUpsetOdds(
            bet.type,
            bet.numbers
        );
    }

    const payout = hit
        ? Math.floor(bet.amount * odds / 10) * 10
        : 0;

    return { hit, payout, odds };
}

// 払戻結果を表示
function displayPayouts(resultOrder) {

    const payoutSummary =
        document.getElementById("payout-summary");

    let totalPayout = 0;
    let hitCount = 0;

    let html = "";

    // 大波乱イベントの表示
    if (isBigUpsetRace) {
        html += `
            <div class="big-upset-banner">
                <h2>⚡ 歴史的大波乱！ ⚡</h2>
                <p>超高額配当が発生しました！</p>
            </div>
        `;
    }

    html += "<h3>購入馬券の払戻結果</h3>";

    if (currentBets.length === 0) {
        html += "<p>購入した馬券はありません。</p>";
    }

    currentBets.forEach(bet => {

        const result = calculateTicketPayout(
            bet,
            resultOrder
        );

        // 購入枚数の集計
        totalTicketCount++;

        if (result.hit) {
            totalHitCount++;
            hitCount++;

            totalPayout += result.payout;

            const selectionLabel =
                bet.type === "枠連"
                    ? `${bet.numbers.join(" - ")}枠`
                    : `${bet.numbers.join(" - ")}番`;

            // 的中した馬券だけ表示
            html += `
                <div class="payout-ticket">
                    <strong>${bet.type}</strong>
                    ${selectionLabel}<br>
                    購入金額：
                    ${bet.amount.toLocaleString()}円<br>
                    オッズ：
                    ${result.odds.toFixed(1)}倍<br>
                    <strong>
                        的中！
                        払戻額：
                        ${result.payout.toLocaleString()}円
                    </strong>
                </div>
            `;
        }
    });

    // 的中がなかった場合
    if (hitCount === 0 && currentBets.length > 0) {
        html += `
            <p class="no-hit-message">
                的中した馬券はありません。
            </p>
        `;
    }

    html += `
        <div class="payout-total">
            合計払戻額：
            ${totalPayout.toLocaleString()}円
        </div>
    `;

    payoutSummary.innerHTML = html;

    // 払戻金を所持金に加算
    totalPayoutAmount += totalPayout;
    money += totalPayout;

    updateMoneyDisplay();
}

// すべての馬券の払戻結果を表示
function displayOfficialPayouts(resultOrder) {

    const container =
        document.getElementById("official-payouts");

    const first = resultOrder[0];
    const second = resultOrder[1];
    const third = resultOrder[2];

    const firstFrame = first.frame;
    const secondFrame = second.frame;

    const winningTickets = [

        // 単勝
        {
            type: "単勝",
            numbers: [first.number]
        },

        // 複勝
        ...resultOrder.slice(0, 3).map(horse => ({
            type: "複勝",
            numbers: [horse.number]
        })),

        // ワイド
        {
            type: "ワイド",
            numbers: [first.number, second.number]
                .sort((a, b) => a - b)
        },
        {
            type: "ワイド",
            numbers: [first.number, third.number]
                .sort((a, b) => a - b)
        },
        {
            type: "ワイド",
            numbers: [second.number, third.number]
                .sort((a, b) => a - b)
        },

        // 枠連
        {
            type: "枠連",
            numbers: [firstFrame, secondFrame]
                .sort((a, b) => a - b)
        },

        // 馬単
        {
            type: "馬単",
            numbers: [first.number, second.number]
        },

        // 馬連
        {
            type: "馬連",
            numbers: [first.number, second.number]
                .sort((a, b) => a - b)
        },

        // 三連複
        {
            type: "三連複",
            numbers: [first.number, second.number, third.number]
                .sort((a, b) => a - b)
        },

        // 三連単
        {
            type: "三連単",
            numbers: [first.number, second.number, third.number]
        }
    ];

    let html = "";

    // 大波乱イベントの表示
    if (isBigUpsetRace) {
        html += `
            <div class="big-upset-banner">
                <h2>⚡ 超高額配当発生！ ⚡</h2>
                <p>歴史に残る大波乱となりました！</p>
            </div>
        `;
    }

    html += `
        <h3>
            ${todayRacecourse.replace("競馬場", "")}${currentRace}レース
            ${raceSchedule[currentRace - 1].name} 払戻金
        </h3>

        <table class="official-payout-table">
            <thead>
                <tr>
                    <th>馬券</th>
                    <th>組み合わせ</th>
                    <th>オッズ</th>
                    <th>払戻金額</th>
                </tr>
            </thead>
            <tbody>
    `;

    winningTickets.forEach(ticket => {

        // 大波乱なら特別オッズ
        const odds = isBigUpsetRace
            ? calculateUpsetOdds(
                ticket.type,
                ticket.numbers
            )
            : Math.round(
                calculateBetOdds(
                    ticket.type,
                    ticket.numbers
                ) * 10
            ) / 10;

        const payout = Math.floor(
            100 * odds / 10
        ) * 10;

        const label = ticket.numbers.join(" - ");

        html += `
            <tr>
                <td>${ticket.type}</td>
                <td>${label}</td>
                <td>${odds.toFixed(1)}倍</td>
                <td>${payout.toLocaleString("ja-JP")}円</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

// 次のレースへ進む
function nextRace() {
    currentRace++;

    document.getElementById("result-section").style.display =
        "none";

    // 所持金を再表示
    document.querySelector(".status-panel").classList.remove("hide-money");

    document.getElementById("start-button").style.display =
        "block";

    initializeRace();

    window.scrollTo(0, 0);
}

// 最終結果を表示する
function showFinalResult() {

    // レース結果画面を非表示
    document.getElementById("result-section").style.display = "none";

    // 出走表・馬券購入画面を非表示
    document.getElementById("race-preparation").style.display = "none";

    // 最終結果画面を表示
    document.getElementById("final-result-section").style.display = "block";
    
    window.scrollTo(0, 0);

    const profit = money - INITIAL_MONEY;

    const recoveryRate = totalBetAmount > 0
        ? totalPayoutAmount / totalBetAmount * 100
        : 0;

    document.getElementById("final-money").textContent =
        money.toLocaleString("ja-JP") + "円";

    document.getElementById("final-profit").textContent =
        (profit >= 0 ? "+" : "") +
        profit.toLocaleString("ja-JP") + "円";

    document.getElementById("final-bet").textContent =
        totalBetAmount.toLocaleString("ja-JP") + "円";

    document.getElementById("final-payout").textContent =
        totalPayoutAmount.toLocaleString("ja-JP") + "円";

    document.getElementById("final-hit").textContent =
        `${totalHitCount} / ${totalTicketCount}`;

    document.getElementById("final-recovery").textContent =
        recoveryRate.toFixed(1) + "%";
}

// タイトル画面に戻る
function returnToTitle() {

    // ゲーム画面を非表示
    document.getElementById("game-screen").style.display =
        "none";

    // 最終結果画面を非表示
    document.getElementById("final-result-section").style.display =
        "none";

    // タイトル画面を表示
    document.getElementById("title-screen").style.display =
        "flex";

    window.scrollTo(0, 0);
}

// ボタンを押したときの音
function playButtonSound() {
    const audioContext = new (
        window.AudioContext || window.webkitAudioContext
    )();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
        800,
        audioContext.currentTime
    );

    gainNode.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.08
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);

    oscillator.onended = () => {
        audioContext.close();
    };
}

// 買い方を変更したとき
document.getElementById("bet-method").addEventListener(
    "change",
    function() {
        updateBetInputs();
    }
);

// すべてのボタンにクリック音を設定
document.addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (button && !button.disabled) {
        playButtonSound();
    }
});