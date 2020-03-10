/**
 *      OLDSCHOOL RUNESCAPE COMBAT CALCULATOR
 *
 *            *** WORK IN PROGRESS ***
 *
 **/

const { ref, computed, watch, onMounted, onUnmounted, reactive } = window.vueCompositionApi;

Vue.config.productionTip = false;
Vue.use(vueCompositionApi.default);





//========================================================================

// Make a computed value which syncs converted values to multiple objects

//========================================================================
let makeComputedConversionSync = (base, conversions) => {
  return computed({
    get() {
      return base.ref;
    },
    set(input) {
      let newVal = typeof base.mutator !== 'undefined' ? base.mutator(input) : input;

      let oldVal = base.ref;

      // Create an empty object for each conversion
      let newBase = {};
      let conversionQueue = conversions.map(item => ({}));

      let hasChanges = false;
      let keys = Object.keys(newVal);
      keys.map(key => {
        // If attributes have changed
        let val = base.sanitize(newVal[key]);
        if (typeof oldVal === 'undefined' || val != base.sanitize(oldVal[key])) {
          // Accumilate new values
          newBase[key] = val;

          // Accumilate converted values
          conversions.map((item, i) => {
            conversionQueue[i][key] = item.convert(val);
          });
          hasChanges = true;
        }
      });

      // Apply changes
      if (hasChanges) {
        base.apply(base.ref, newBase);
        conversions.map((item, i) => {
          item.apply(item.ref, conversionQueue[i]);
        });
      }
    } });

};


//====================================================================================

// Create a series of object which will automatically convert to all specified units
// Ex: updating the level will also update the EXP and vice versa

//====================================================================================
let makeSyncObj = units => {
  let keys = Object.keys(units);

  let makeApplySync = (ref, apply) => val => {
    //apply(ref, val);
    ref.value = { ...ref, ...val };
  };

  // Method requried to update synced reactivly
  let makeUpdateSync = (ref, sanitize = x => x) => (key, value) => {
    let temp = { ...ref.value };
    temp[key] = sanitize(value);
    ref.value = temp;
  };

  let results = {};
  keys.map(key => {
    let unit = units[key];
    let conversions = unit.conversions || {};
    let conversionKeys = Object.keys(conversions);
    let buildConversionSpec = cKey => ({
      ...units[cKey],
      convert: conversions[cKey] });

    let computedRef = makeComputedConversionSync(unit, conversionKeys.map(buildConversionSpec));
    results[key] = {
      computed: computedRef,
      apply: makeApplySync(computedRef, unit.apply),
      update: makeUpdateSync(computedRef, unit.sanitize) };

  });
  return results;
};




//======================================================

//                    ACCOUNT TYPES

//======================================================
let accountConfigs = [
{
  name: 'Starter',
  stats: {
    attack: 1,
    strength: 1,
    defence: 1,
    hitpoints: 10,
    prayer: 1,
    ranged: 1,
    magic: 1 } },


{
  name: 'Maxed',
  stats: {
    attack: 99,
    strength: 99,
    defence: 99,
    hitpoints: 99,
    prayer: 99,
    ranged: 99,
    magic: 99 } },



{
  name: 'Maxed Meele',
  stats: {
    attack: 99,
    strength: 99,
    defence: 99,
    hitpoints: 99,
    prayer: 99,
    ranged: 1,
    magic: 1 } },


{
  name: 'Maxed Range',
  stats: {
    attack: 1,
    strength: 1,
    defence: 99,
    hitpoints: 99,
    prayer: 99,
    ranged: 99,
    magic: 1 } },



{
  name: 'Maxed Magic',
  stats: {
    attack: 1,
    strength: 1,
    defence: 99,
    hitpoints: 99,
    prayer: 99,
    ranged: 1,
    magic: 99 } },


{
  name: 'Base 60',
  stats: {
    attack: 60,
    strength: 60,
    defence: 60,
    hitpoints: 60,
    prayer: 60,
    ranged: 60,
    magic: 60 } },


{
  name: 'Base 85',
  stats: {
    attack: 85,
    strength: 85,
    defence: 85,
    hitpoints: 85,
    prayer: 85,
    ranged: 85,
    magic: 85 } },


{
  name: 'Maxed Pure',
  stats: {
    attack: 99,
    strength: 99,
    defence: 1,
    hitpoints: 99,
    prayer: 52,
    ranged: 99,
    magic: 99 } },


{
  name: 'Maxed Rune Pure',
  stats: {
    attack: 40,
    strength: 99,
    defence: 40,
    hitpoints: 99,
    prayer: 52,
    ranged: 99,
    magic: 99 } },


{
  name: 'Maxed Zerker',
  stats: {
    attack: 40,
    strength: 99,
    defence: 45,
    hitpoints: 99,
    prayer: 52,
    ranged: 99,
    magic: 99 } },


{
  name: 'Defence Tank',
  stats: {
    attack: 1,
    strength: 1,
    defence: 75,
    hitpoints: 61,
    prayer: 1,
    ranged: 1,
    magic: 1 } }];



//------------------------------------------------------


//======================================================

//                    RADAR CHART

//======================================================
let useRadarChart = (chartId, chartData) => {
  var playerChart;
  let initGraph = () => {
    var ctx = document.getElementById(chartId).getContext('2d');
    playerChart = new Chart(ctx, {
      type: 'radar',
      data: chartData.value,
      options: {
        animation: false,
        scale: {
          angleLines: {
            display: false },

          ticks: {
            suggestedMin: -1,
            suggestedMax: 99 } } } });




    playerChart.update();
  };

  onMounted(() => {
    initGraph();

    // Reduce the UI lag when adjusting the sliders
    let updateGraph = _.debounce(() => {
      playerChart.data = chartData.value;
      playerChart.update();
    }, 30, { trailing: true });


    watch(chartData, (newVal, oldVal) => {
      if (newVal) {
        updateGraph();
      }
    });
  });

  let redraw = () => {
    if (typeof playerChart !== 'undefined')
    playerChart.update();
  };

  return {
    redraw };

};
//------------------------------------------------------




//======================================================

//                 LINK TWO VALUES

//======================================================
let linkedValue = (oldVal, newVal, fieldA, fieldB) => {

  // If the A field has not changes sync it
  if (oldVal[fieldA] == newVal[fieldA]) {
    newVal[fieldA] = newVal[fieldB];
  } else {
    console.log('same b');
    newVal[fieldB] = newVal[fieldA];
  }
};
//------------------------------------------------------


//------------------------------------------------------


//======================================================

// Execute a function if toggled on and value changes

//======================================================
let makeToggleWatch = (defaultValue, valB, func) => {
  let isActive = ref(defaultValue);

  let toggle = () => {
    isActive.value = !isActive.value;
  };

  watch([isActive, () => ({ ...valB })], newVal => {
    if (isActive.value) {
      func(valB);
    }
  });

  return {
    isActive,
    toggle };

};
//------------------------------------------------------




//======================================================

//                  Toggle Value

//======================================================
let useToggle = (defaultValue = false) => {
  let isActive = ref(Boolean(defaultValue));

  let toggle = () => {
    console.log('toggle');
    isActive.value = !isActive.value;
  };

  return {
    isActive,
    toggle };

};
//------------------------------------------------------



//======================================================

//                      Prompt

//======================================================
let usePrompt = (defaultValue = false, confirmCallback = () => {}, cancelCallback = () => {}) => {
  let isActive = ref(defaultValue);

  let toggle = () => {
    isActive.value = !isActive.value;
  };

  let cancel = () => {
    isActive.value = false;
    cancelCallback();
  };
  let confirm = () => {
    isActive.value = false;
    confirmCallback();
  };

  return {
    isActive,
    toggle,
    cancel,
    confirm };

};
//------------------------------------------------------



//======================================================

//                      TabSet

//======================================================
let useTabset = (tabLabels, defaultValue = 0) => {
  let tab = ref(defaultValue);
  let tabs = ref(tabLabels);

  return {
    tab,
    tabs };

};
//------------------------------------------------------



//======================================================

//    Add Crtl-{char} event listners for testing

//======================================================
let useCrtlListeners = () => {

  let crtlListeners = [];

  onMounted(() => {
    crtlListeners.map(callback => {
      window.addEventListener('keydown', callback);
    });
  });
  onUnmounted(() => {
    crtlListeners.map(callback => {
      window.removeEventListener('keydown', callback);
    });
  });


  let makeListener = (key, callback) => {
    let temp = event => {
      if (event.ctrlKey === true && event.key === key)
      callback();
      event.preventDefault();
    };
    crtlListeners.push(temp);
  };

  return {
    makeListener };

};
//------------------------------------------------------






//======================================================

//                    Skill Icons

//======================================================
let useSkillIcons = () => {
  let skillImageDict = {
    "agility": "https://oldschool.runescape.wiki/images/8/86/Agility_icon.png?22e10",
    "attack": "https://oldschool.runescape.wiki/images/f/fe/Attack_icon.png?b4bce",
    "construction": "https://oldschool.runescape.wiki/images/f/f6/Construction_icon.png?f9bf7",
    "cooking": "https://oldschool.runescape.wiki/images/d/dc/Cooking_icon.png?a0156",
    "crafting": "https://oldschool.runescape.wiki/images/c/cf/Crafting_icon.png?a1f71",
    "defence": "https://oldschool.runescape.wiki/images/b/b7/Defence_icon.png?ca0cd",
    "farming": "https://oldschool.runescape.wiki/images/f/fc/Farming_icon.png?558fa",
    "firemaking": "https://oldschool.runescape.wiki/images/9/9b/Firemaking_icon.png?45ea0",
    "fishing": "https://oldschool.runescape.wiki/images/3/3b/Fishing_icon.png?15a98",
    "fletching": "https://oldschool.runescape.wiki/images/9/93/Fletching_icon.png?15cda",
    "herblore": "https://oldschool.runescape.wiki/images/0/03/Herblore_icon.png?ffa9e",
    "hitpoints": "https://oldschool.runescape.wiki/images/9/96/Hitpoints_icon.png?a4819",
    "hunter": "https://oldschool.runescape.wiki/images/d/dd/Hunter_icon.png?8762f",
    "magic": "https://oldschool.runescape.wiki/images/5/5c/Magic_icon.png?334cf",
    "mining": "https://oldschool.runescape.wiki/images/4/4a/Mining_icon.png?00870",
    "prayer": "https://oldschool.runescape.wiki/images/f/f2/Prayer_icon.png?ca0dc",
    "ranged": "https://oldschool.runescape.wiki/images/1/19/Ranged_icon.png?01b0e",
    "runecraft": "https://oldschool.runescape.wiki/images/6/63/Runecraft_icon.png?c278c",
    "slayer": "https://oldschool.runescape.wiki/images/2/28/Slayer_icon.png?cd34f",
    "smithing": "https://oldschool.runescape.wiki/images/d/dd/Smithing_icon.png?d26c5",
    "strength": "https://oldschool.runescape.wiki/images/1/1b/Strength_icon.png?e6e0c",
    "thieving": "https://oldschool.runescape.wiki/images/4/4a/Thieving_icon.png?56b20",
    "woodcutting": "https://oldschool.runescape.wiki/images/f/f4/Woodcutting_icon.png?6ead4" };


  let getIcon = skill => {
    return skillImageDict[_.lowerCase(skill)];
  };

  return {
    getIcon };

};



//======================================================

//                RUNESCAPE STAT UTILS

//======================================================
let useStatUtils = () => {

  // Compact way to store the level info [level, exp, expTillNextLevel]
  let getRsLevel = lvlData => lvlData[0];
  let getRsExp = lvlData => lvlData[1];
  let rsLevelsRaw = [
  [1, 0, 83], [2, 83, 91], [3, 174, 102], [4, 276, 112], [5, 388, 124], [6, 512, 138], [7, 650, 151], [8, 801, 168], [9, 969, 185], [10, 1154, 204], [11, 1358, 226], [12, 1584, 249], [13, 1833, 274], [14, 2107, 304], [15, 2411, 335], [16, 2746, 369], [17, 3115, 408], [18, 3523, 450], [19, 3973, 497], [20, 4470, 548], [21, 5018, 606], [22, 5624, 667], [23, 6291, 737], [24, 7028, 814], [25, 7842, 898], [26, 8740, 990], [27, 9730, 1094], [28, 10824, 1207], [29, 12031, 1332], [30, 13363, 1470], [31, 14833, 1623], [32, 16456, 1791], [33, 18247, 1977], [34, 20224, 2182], [35, 22406, 2409], [36, 24815, 2658], [37, 27473, 2935], [38, 30408, 3240], [39, 33648, 3576], [40, 37224, 3947], [41, 41171, 4358], [42, 45529, 4810], [43, 50339, 5310], [44, 55649, 5863], [45, 61512, 6471], [46, 67983, 7144], [47, 75127, 7887], [48, 83014, 8707], [49, 91721, 9612], [50, 101333, 10612], [51, 111945, 11715], [52, 123660, 12934], [53, 136594, 14278], [54, 150872, 15764], [55, 166636, 17404], [56, 184040, 19214], [57, 203254, 21212], [58, 224466, 23420], [59, 247886, 25856], [60, 273742, 28546], [61, 302288, 31516], [62, 333804, 34795], [63, 368599, 38416], [64, 407015, 42413], [65, 449428, 46826], [66, 496254, 51699], [67, 547953, 57079], [68, 605032, 63019], [69, 668051, 69576], [70, 737627, 76818], [71, 814445, 84812], [72, 899257, 93638], [73, 992895, 103383], [74, 1096278, 114143], [75, 1210421, 126022], [76, 1336443, 139138], [77, 1475581, 153619], [78, 1629200, 169608], [79, 1798808, 187260], [80, 1986068, 206750], [81, 2192818, 228269], [82, 2421087, 252027], [83, 2673114, 278259], [84, 2951373, 307221], [85, 3258594, 339198], [86, 3597792, 374502], [87, 3972294, 413482], [88, 4385776, 456519], [89, 4842295, 504037], [90, 5346332, 556499], [91, 5902831, 614422], [92, 6517253, 678376], [93, 7195629, 748985], [94, 7944614, 826944], [95, 8771558, 913019], [96, 9684577, 1008052], [97, 10692629, 1112977], [98, 11805606, 1228825], [99, 13034431, 0]];


  let getHumanReadableRsLevels = () => {
    return rsLevelsRaw.reduce((acc, cur) => {
      acc.push({
        level: cur[0],
        exp: cur[1],
        expTillNext: cur[2] });

      return acc;
    }, []);
  };

  /* Attack styles and what EXP they grant per hit
     let attakStyles = [
       {
         style: "Accurate",
         type: "Meele",
         exp: {
           attack: 4,
           hitpoints: 1.33,
         },
       },
       {
         style: "agressive",
         type: "Meele",
         exp: {
           strength: 4,
           hitpoints: 1.33,
         },
       },
       {
         style: "Defensive",
         type: "Meele",
         exp: {
           defence: 4,
           hitpoints: 1.33,
         },
       },
       {
         style: "Controlled",
         type: "Meele",
         exp: {
           attack: 1.33,
           strength: 1.33,
           defence: 1.33,
           hitpoints: 1.33,
         },
       },
       {
         style: "Accurate",
         type: "Ranged",
         exp: {
           range: 4,
           hitpoints: 1.33,
         },
       },
       {
         style: "Cannon",
         type: "Ranged",
         exp: {
           range: 1,
         },
       },
       {
         style: "Rapid",
         type: "Ranged",
         exp: {
           range: 4,
           hitpoints: 1.33,
         },
       },
       {
         style: "Defensive",
         type: "Ranged",
         exp: {
           range: 2,
           defence: 2,
           hitpoints: 1.33,
         },
       },
        {
         style: "Offensive",
         type: "Magic",
         exp: {
           magic: 2,
           hitpoints: 1.33,
         },
       },
       {
         style: "Defensive",
         type: "Magic",
         exp: {
           magic: 1.33,
           defence: 1,
           hitpoints: 1.33,
         },
       },
     ];
     */


  let binaryLvlSearch = (array, target, getExp = x => x, getResult = x => x) => {
    target = parseFloat(target);
    let maxIterations = Math.floor(rsLevelsRaw.length / 2);
    let iterations = 0;
    maxIterations = 10;

    let clampRange = input => Math.min(Math.max(0, input), len - 1);
    let range = array.map(getExp);
    let len = range.length;

    let startIndex = 0;
    let endIndex = len - 1;
    let midIndex;

    midIndex = startIndex + Math.floor((endIndex - startIndex) / 2);

    while (startIndex <= endIndex && iterations < maxIterations) {
      iterations = iterations + 1;

      if (range[endIndex] <= target) {
        return getResult(array[endIndex]);
      } else if (range[midIndex] <= target && target < range[clampRange(midIndex + 1)]) {
        return getResult(array[midIndex]);
      } else if (range[clampRange(midIndex + 1)] < target) {
        startIndex = midIndex;
        midIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
      } else if (range[midIndex] < target) {
        midIndex = midIndex + 1;
      } else {
        endIndex = midIndex;
        midIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
      }
    }
    console.error('Issue with the BinarySearch');
  };

  // if the number is too long take the last 2 chars and clamp from 1 to 99
  let clampLevel = lvl => Math.min(Math.max(1, parseInt(lvl)), 99);
  let wrapLevel = lvl => Math.min(Math.max(1, parseInt(String(lvl).slice(-2))), 99);

  let applyStats = (oldStats, newStats) => {
    let keys = Object.keys(newStats);
    keys.map(key => {
      oldStats[key] = newStats[key];
    });
    return oldStats;
  };


  let combatStatKeys = ['attack', 'strength', 'defence', 'hitpoints', 'prayer', 'ranged', 'magic'];


  let makeStats = (override = {}) => {
    let temp = {};
    if (typeof override === 'object') {
      temp = override;
    } else {
      let i = parseInt(override);
      temp = {
        attack: i,
        strength: i,
        defence: i,
        hitpoints: i,
        prayer: i,
        ranged: i,
        magic: i };

    }

    return reactive({
      attack: 1,
      strength: 1,
      defence: 1,
      hitpoints: 10,
      prayer: 1,
      ranged: 1,
      magic: 1,
      ...temp });

  };


  let levelToXp = level => {
    let lvlData = rsLevelsRaw[clampLevel(level) - 1];
    if (typeof lvlData !== 'undefined')
    return getRsExp(lvlData);
    return 0;
  };


  let xpToLevel = (xp = 0) => {
    let x = binaryLvlSearch(rsLevelsRaw, parseFloat(xp), getRsExp);
    return getRsLevel(x);
  };


  let convertStatLevelsToXp = theLvls => {
    let keys = Object.keys(theLvls);
    let newObj = {};
    keys.map(key => {
      newObj[key] = levelToXp(theLvls[key]);
    });
    return newObj;
  };


  let convertStatXpToLevels = theXp => {
    let keys = Object.keys(theXp);
    let newObj = {};
    keys.map(key => {
      newObj[key] = xpToLevel(theXp[key]);
    });
    return newObj;
  };

  let calculateTotalExp = stats => {
    let totalExp = 0;
    let keys = Object.keys(stats);
    keys.map(key => {
      let skillExp = stats[key];
      totalExp += skillExp;
    });
    return totalExp;
  };



  let sanitizeLevel = val => {
    let temp = parseFloat(val);
    temp = isNaN(temp) ? 0 : temp;
    return clampLevel(temp);
  };


  let sanitizeExp = val => {
    let temp = parseFloat(val);
    temp = isNaN(temp) ? 0 : temp;
    return Math.max(temp, 0);
  };

  // Sync Exp and levels 
  let makeSyncedExpStats = (lvlRef, expRef) => {
    // Levels
    let base = {
      ref: lvlRef,
      sanitize: sanitizeLevel,
      apply: applyStats };


    // Experiance
    let base2 = {
      ref: expRef,
      sanitize: sanitizeExp,
      apply: applyStats };


    // Synchronize the Stats and Exp values 
    let syncLvls = makeComputedConversionSync(base, [
    { ...base2, convert: levelToXp }]);


    let syncExp = makeComputedConversionSync(base2, [
    { ...base, convert: xpToLevel }]);


    return [syncLvls, syncExp];
  };


  return {
    getHumanReadableRsLevels,
    combatStatKeys,
    makeSyncedExpStats,
    sanitizeLevel,
    sanitizeExp,
    clampLevel,
    wrapLevel,
    levelToXp,
    xpToLevel,
    applyStats,
    makeStats,
    convertStatLevelsToXp,
    convertStatXpToLevels,
    calculateTotalExp };

};




//====================================================================================

//                              LOCAL STORAGE PRESETS 

//====================================================================================
let useSavableStats = stats => {
  let records = ref([]);


  let loadRecords = () => {
    let parsed;
    let results = [];
    let recordString = localStorage.getItem('records');

    if (typeof recordString !== 'undefined') {
      parsed = JSON.parse(recordString);
      if (Array.isArray(parsed)) {
        results = parsed;
      }
    }
    records.value = results;
  };
  let saveRecords = () => {
    let val = JSON.stringify(records.value);
    console.log('saved', val);
    localStorage.setItem('records', val);
  };

  let removeRecord = i => {
    records.value.splice(i, 1);
    saveRecords();
  };

  let removeRecordByName = name => {
    let index = records.value.findIndex(item => item.name === name);
    if (index > -1) {
      removeRecord(index);
    }
  };

  let addRecord = (name, config) => {
    removeRecordByName(name);
    let temp = [...records.value, {
      name,
      config: { ...config } }];

    records.value = temp;
    saveRecords();
  };



  let input = ref('');
  let confirmCallback = () => {
    addRecord(input.value, stats);
    input.value = '';
  };
  let cancelCallback = () => {
    input.value = '';
  };

  let prompt = usePrompt(false, confirmCallback);


  onMounted(() => {
    loadRecords();
  });

  return {
    loadRecords,
    saveRecords,
    removeRecord,
    addRecord,
    records,
    prompt,
    input };

};


//====================================================================================

//                                  COMBAT CALCULATOR

//====================================================================================
function useCombatCalc(statUtils) {

  const lockedStats = reactive({
    attack: false,
    strength: false,
    defence: false,
    hitpoints: false,
    prayer: false,
    ranged: false,
    magic: false });




  let maximizeOffence = useToggle(false);
  let estimateHitpoints = useToggle(false);



  let scaler = 0.325;

  // Weights are essentially the normalized value
  let computeRangeWeight = value => Math.floor(value.ranged * 1.5) * scaler;
  let computeMagicWeight = value => Math.floor(value.magic * 1.5) * scaler;
  let getRangeLevelFromWeight = weight => Math.floor(weight / scaler / 1.5); // inverse of computeRangeWeight

  let getHpWeightValue = hp => hp / 4;
  let getDefenceWeightValue = defence => defence / 4;
  let getPrayerWeightValue = prayer => prayer / 8;
  let computeDefenceWeight = value => getDefenceWeightValue(value.defence) + getHpWeightValue(value.hitpoints);

  let computeMeeleOffense = value => (value.attack + value.strength) * scaler;
  let computeDistanceOffence = value => Math.max(computeRangeWeight(value), computeMagicWeight(value));

  let computeEquivalentMeeleOffence = value => computeDistanceOffence(value) / scaler;
  let calculateEstimatedHitpoints = (baseExpVals, newExpVal) => {
    let sumMeele = 0;
    let sumRanged = 0;
    let sumMagic = 0;

    sumMeele += Math.max(0, parseFloat(newExpVal.attack - baseExpVals.attack));
    sumMeele += Math.max(0, parseFloat(newExpVal.strength - baseExpVals.strength));
    sumMeele += Math.max(0, parseFloat(newExpVal.defence - baseExpVals.defence));

    sumRanged += Math.max(0, parseFloat(newExpVal.ranged - baseExpVals.ranged));
    sumMagic += Math.max(0, parseFloat(newExpVal.magic - baseExpVals.magic));

    // Assuming Offensive/ defensive Meele and only offensive range and magic are used
    let baseHpXp = parseFloat(baseExpVals.hitpoints);
    return baseHpXp + sumMeele / 4 * 1.33 + sumRanged / 4 * 1.33 + sumMagic / 2 * 1.33;
  };
  let computeMeeleDeltaFromDistance = (value, addedHpWeight = 0) => {
    let distanceWeight = Math.max(computeRangeWeight(value), computeMagicWeight(value));
    let meeleWeight = (value.attack + value.strength) * scaler;

    let meeleDelta = Math.floor(Math.ceil(distanceWeight - meeleWeight - addedHpWeight) / scaler);
    return meeleDelta;
  };



  // Link range and magic together since only the highest one matters
  let linkedDistanceOffence = useToggle(false);



  //==============================

  //        BASE VALUES

  //==============================
  // Store the original values from when applied
  const baseStats = statUtils.makeStats();
  const baseExp = statUtils.makeStats(statUtils.convertStatLevelsToXp(baseStats));
  let input = {
    lvl: {
      ref: baseStats,
      sanitize: statUtils.sanitizeLevel,
      apply: statUtils.applyStats,
      conversions: {
        exp: statUtils.levelToXp } },


    exp: {
      ref: baseExp,
      sanitize: statUtils.sanitizeExp,
      apply: statUtils.applyStats,
      conversions: {
        lvl: statUtils.xpToLevel } } };



  let baseValues = makeSyncObj(input);
  let syncedBaseStats = baseValues.lvl.computed;
  let syncedBaseExp = baseValues.exp.computed;
  let updateSyncedBaseStats = baseValues.lvl.update;
  let updateSyncedBaseExp = baseValues.exp.update;


  //==============================

  //      CALCULATOR VALUES

  //==============================
  const stats = statUtils.makeStats();
  const exp = statUtils.makeStats(statUtils.convertStatLevelsToXp(stats));
  let computedLevelMutator = value => {
    // Detect attributes being changed
    let oldValue = stats;
    let newValue = value;
    let alteringSkills = statUtils.combatStatKeys.reduce((acc, key) => {
      acc[key] = parseInt(oldValue[key]) !== parseInt(newValue[key]);
      return acc;
    }, {});


    // --------------------------------------------------------------
    // Based on input values determine which optimization to use
    // If only one value being altered detect if offensive stat 
    let alteringCategoryDominance = '';
    if (alteringSkills['ranged'] || alteringSkills['magic']) {
      alteringCategoryDominance = 'distance';
    }
    if (alteringSkills['attack'] || alteringSkills['strength']) {
      alteringCategoryDominance = 'meele';
    }

    if (maximizeOffence.isActive.value) {
      // If stats are the same and just being refreshed detect optimization to do
      if (alteringCategoryDominance === '') {
        let meeleWeight = computeMeeleOffense(value);
        let distanceWeight = computeDistanceOffence(value);

        if (meeleWeight > distanceWeight) {
          alteringCategoryDominance = 'meele';
        } else if (distanceWeight > meeleWeight) {
          alteringCategoryDominance = 'distance';
        }
      }
    }
    // --------------------------------------------------------------




    // --------------------------------------------------------------
    // Link Ranges and Mage since only max value is used
    if (linkedDistanceOffence.isActive.value)
    linkedValue(stats, value, 'magic', 'ranged');
    // --------------------------------------------------------------




    // --------------------------------------------------------------
    // Estimate Hitpoints
    let addedHpLevels = 0;
    if (estimateHitpoints.isActive.value) {
      let baseHitpoints = baseExp.hitpoints;
      let convetedExp = statUtils.convertStatLevelsToXp(value);
      let estimatedHpXp = calculateEstimatedHitpoints(baseExp, convetedExp);
      let estimatedHpLvl = statUtils.xpToLevel(estimatedHpXp);

      addedHpLevels = estimatedHpLvl - value.hitpoints;

      value.hitpoints = Math.max(10, estimatedHpLvl);
    }
    // --------------------------------------------------------------



    // --------------------------------------------------------------
    // Maximize Meele

    // Change Meele levels based on Ranged
    if (maximizeOffence.isActive.value && alteringCategoryDominance === 'distance') {
      // Get difference in (Att + Strength) required to equate to the ranged equivalent
      let delta = computeMeeleDeltaFromDistance(value);

      // Split the delta -----
      let numNotLocked = 0;
      if (!lockedStats.attack)
      ++numNotLocked;
      if (!lockedStats.strength)
      ++numNotLocked;

      if (numNotLocked == 2) {
        // Split required level between the two almost equally - favoring str
        let half = Math.ceil(delta / 2);
        value.strength = statUtils.clampLevel(value.strength + half);
        value.attack = statUtils.clampLevel(value.attack + delta - half);
      } else if (!lockedStats.attack) {
        value.attack = statUtils.clampLevel(value.attack + delta);
      } else if (!lockedStats.strength) {
        value.strength = statUtils.clampLevel(value.strength + delta);
      }
    }

    // Change Range based on meele
    if (maximizeOffence.isActive.value && alteringCategoryDominance === 'meele') {
      let rangedLvl = getRangeLevelFromWeight(computeMeeleOffense(value));

      // Ranged and Magic are equivalent
      value.ranged = statUtils.clampLevel(rangedLvl);
      value.magic = statUtils.clampLevel(rangedLvl);
    }
    // --------------------------------------------------------------


    return value;
  };
  input = {
    lvl: {
      ref: stats,
      sanitize: statUtils.sanitizeLevel,
      apply: statUtils.applyStats,
      mutator: computedLevelMutator,
      conversions: {
        exp: statUtils.levelToXp } },


    exp: {
      ref: exp,
      sanitize: statUtils.sanitizeExp,
      apply: statUtils.applyStats,
      conversions: {
        lvl: statUtils.xpToLevel } } };



  let calcValues = makeSyncObj(input);
  let syncedStats = calcValues.lvl.computed;
  let syncedExp = calcValues.exp.computed;
  let updateSyncedStats = calcValues.lvl.update;
  let updateSyncedExp = calcValues.exp.update;



  // Update synced values when estimateHitpoints is toggled
  watch([
  estimateHitpoints.isActive,
  maximizeOffence.isActive,
  linkedDistanceOffence.isActive,
  () => ({ ...lockedStats })],
  (oldVal, newVal) => {
    if (oldVal != newVal)
    calcValues.lvl.computed.value = calcValues.lvl.computed.value;
  });




  // Action for "Use Stats"
  let applyStatsToCalc = newStats => {

    // Remove locks and linked values
    linkedDistanceOffence.isActive.value = false;
    maximizeOffence.isActive.value = false;
    Object.keys(lockedStats).map(key => {
      lockedStats[key] = false;
    });

    // Update stats
    baseValues.exp.apply(newStats);
    calcValues.exp.apply(newStats);
  };

  // Close Range
  var meleeOffense = computed(() => computeMeeleOffense(syncedStats.value));

  let defWeight = computed(() => computeDefenceWeight(syncedStats.value));
  let prayerWeight = computed(() => Math.floor(syncedStats.value.prayer / 8));
  let baseWeight = computed(() => defWeight.value + prayerWeight.value);


  // Distance
  var rangeWeight = computed(() => computeRangeWeight(syncedStats.value));
  var mageWeight = computed(() => computeMagicWeight(syncedStats.value));
  var distanceOffence = computed(() => computeDistanceOffence(syncedStats.value));

  var cmbLvl = computed(() => {
    var max = Math.max(meleeOffense.value, distanceOffence.value);
    var level = Math.round((baseWeight.value + max) * 100) / 100;
    return level;
  });



  //===========================================================

  // SYNC Methods to find maximal levels for combat level

  //===========================================================

  // Take ranged and mage and find meele stats which won't increase the combat lvl at all





  let deltaValues = computed(() => {
    let delta = {
      lvl: {},
      exp: {} };


    statUtils.combatStatKeys.map(key => {
      delta.lvl[key] = calcValues.lvl.computed.value[key] - baseValues.lvl.computed.value[key];
      delta.exp[key] = calcValues.exp.computed.value[key] - baseValues.exp.computed.value[key];
    });

    return delta;
  });


  return {

    // Player Stats Tabs
    tabset: useTabset([
    { label: 'Lookup', key: 'lookup', icon: 'mdi-magnify' },
    { label: 'Levels', key: 'lvl', icon: 'mdi-chart-bar' },
    { label: 'Experience', key: 'exp', icon: 'mdi-school' }],
    'lvl'),


    // Combat level
    cmbLvl,

    // Base values for the calc brought over from the player stats input
    baseValues,
    lockedStats,

    // Preform optimizations on the stats
    linkedDistanceOffence,
    maximizeOffence,
    estimateHitpoints,


    // Calculator Stats
    calcValues,
    syncedStats,
    syncedExp,
    updateSyncedStats,
    updateSyncedExp,


    // Delta between base and CalcValues
    deltaValues,


    //distanceOffence,
    //meleeOffense,

    applyStatsToCalc,
    getHumanReadableRsLevels: statUtils.getHumanReadableRsLevels

    //----------
  };
}
//========================================================================




// Sync two values when active
let useToggleWatchCallback = (defaultValue, valB, apply) => {
  let isActive = ref(defaultValue);

  let toggle = () => {
    isActive.value = !isActive.value;
  };

  watch([isActive, () => ({ ...valB })], newVal => {
    if (isActive.value) {
      apply(valB);
    }
  });

  return {
    isActive,
    toggle };

};





//====================================================================================

//                                  STATS COMPONENT

//====================================================================================
let statIcon = {
  template: '#stat-icon',
  props: ['src'] };

let playerStats = {
  template: '#stat-input',
  props: ['player-stats'],
  components: {
    'stat-icon': statIcon },

  methods: {
    updateAttr(field, value) {
      let temp = { ...this.playerStats };
      temp[field] = value;
      this.playerStatsInput = temp;
    } },

  computed: {
    playerStatsInput: {
      get() {
        return this.playerStats;
      },
      set(val) {
        this.$emit('update:playerStats', val);
      } } },


  setup() {
    let skillIcons = useSkillIcons();

    return {
      skillIcons };

  } };




//====================================================================================

//                                  VUE APPLICATION

//====================================================================================
new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  components: {
    'player-stats': playerStats,
    'stat-icon': statIcon },

  setup() {


    // Icon methods
    let lockIcon = val => val ? 'mdi-lock' : 'mdi-lock-open-variant-outline';
    let checkIcon = val => val ? 'mdi-check-bold' : 'mdi-close';


    let statUtils = useStatUtils();



    // Make variables for the initial player input
    const playerStats = statUtils.makeStats(40);
    const playerExp = statUtils.makeStats(statUtils.convertStatLevelsToXp(playerStats));


    // Synchronize the Stats and Exp values 
    let input = {
      lvl: {
        ref: playerStats,
        sanitize: statUtils.sanitizeLevel,
        apply: statUtils.applyStats,
        conversions: {
          exp: statUtils.levelToXp } },


      exp: {
        ref: playerExp,
        sanitize: statUtils.sanitizeExp,
        apply: statUtils.applyStats,
        conversions: {
          lvl: statUtils.xpToLevel } } };



    let playerValues = makeSyncObj(input);








    //----------------------------------------------
    // Make Combat Calc
    var combatCalc = useCombatCalc(statUtils);
    //----------------------------------------------


    //----------------------------------------------
    // Make Radar Graph 
    let order = ['hitpoints', 'prayer', 'strength', 'attack', 'magic', 'ranged', 'defence'];
    let chartData = computed(() => {
      return {
        labels: order.map(item => _.upperFirst(item)),
        datasets: [
        {
          label: 'Stats',
          data: order.map(skill => combatCalc.calcValues.lvl.computed.value[skill]) }] };



    });
    let { redraw: redrawChart } = useRadarChart('myChart', chartData);
    //----------------------------------------------









    // Make a toggle to sync the player stats to the calculator
    let liveStatSync = useToggleWatchCallback(false, playerExp, val => combatCalc.applyStatsToCalc(val));
    let { isActive: isLiveStatSync, toggle: toggleLiveStatSync } = liveStatSync;

    let storedStats = useSavableStats(playerStats);

    let skillIcons = useSkillIcons();


    let applyStatsToPlayer = newStats => {
      console.log('applyStatsToPlayer', newStats);
      playerValues.lvl.computed.value = JSON.parse(JSON.stringify(newStats));
    };

    let playerStatsSidebar = useToggle(false);

    let cardStyle = computed(() => {
      let result = {
        //'padding-left': (playerStatsSidebar.isActive.value ? '250px' : '0px'),
        transition: '0.2',
        overflow: 'hidden' };

      return result;
    });




    let c_totalExp = computed(() => {
      return statUtils.calculateTotalExp(playerValues.exp.computed.value);
    });



    //----------------------------------------------
    // Tick Labels
    let useStatTickLabels = baseValues => {

      let skillSliderLabels = computed(() => {

        // Get base levels - Will add an label to indicate the base level
        let baseLevels = baseValues.value;

        let result = {
          attack: [],
          strength: [],
          defence: [],
          hitpoints: [],
          prayer: [],
          ranged: [],
          magic: [] };


        let normalSkills = ['attack', 'strength', 'ranged', 'magic', 'defence', 'prayer'];
        let makeSkillLabel = (skill, i) => {
          result[skill].push(baseLevels[skill] === i ? i : null);
        };

        // Iterate over all the values of the slider and place a label at the base level for each stat
        for (let i = 1; i <= 99; ++i) {
          normalSkills.map(skill => makeSkillLabel(skill, i));

          // Hitpoints minimum level is always 10
          if (i >= 10)
          makeSkillLabel('hitpoints', i);
        }
        return result;
      });


      return {
        skillSliderLabels };

    };
    //----------------------------------------------



    let applyExpFromCalc = values => {
      playerValues.exp.computed.value = { ...values };
    };

    return {
      playerStatsSidebar,
      cardStyle,

      redrawChart,


      // Icons
      lockIcon,
      checkIcon,
      skillIcons,

      // Stored presets
      playerValues,
      accountConfigs,
      storedStats,
      applyStatsToPlayer,
      applyExpFromCalc,

      // Sync stats to calc
      liveStatSync,

      // Combat Calculations
      combatCalc,
      ...useStatTickLabels(combatCalc.baseValues.lvl.computed) };

  },
  data() {
    return {
      tickSize: 0,
      maxSpan: 3,
      min: 1,
      hpMin: 10,
      max: 99,
      slider: 40,
      range: [1, 99] };

  } }).
$mount('#app');