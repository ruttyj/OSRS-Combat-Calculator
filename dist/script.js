const { ref, computed, watch, onMounted, onUnmounted, reactive } = window.vueCompositionApi;

Vue.config.productionTip = false;
Vue.use(vueCompositionApi.default);





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
            suggestedMin: 1,
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
};
//------------------------------------------------------




//======================================================

//                 LINK TWO VALUES

//======================================================
let makeLinkedValueToggle = (defaultValue, objA, fieldA, objB, fieldB, mode = 'first') => {
  const isActive = ref(defaultValue);

  let toggle = () => {
    isActive.value = !isActive.value;
  };

  watch(isActive, (newVal, oldVal) => {
    if (isActive.value && newVal != oldVal) {
      if (mode == 'first')
      objA[fieldA] = objB[fieldB];else
      if (mode == 'max')
      objA[fieldA] = objB[fieldB] = Math.max(objA[fieldA], objB[fieldB]);else
      if (mode == 'min')
      objA[fieldA] = objB[fieldB] = Math.min(objA[fieldA], objB[fieldB]);
    }
  });
  watch(() => objA[fieldA], (newVal, oldVal) => {
    if (isActive.value && newVal != oldVal)
    objB[fieldB] = objA[fieldA];
  });
  watch(() => objB[fieldB], (newVal, oldVal) => {
    if (isActive.value && newVal != oldVal) {
      objA[fieldA] = objB[fieldB];
    }
  });

  return {
    isActive,
    toggle };

};
//------------------------------------------------------


//======================================================

//                 LINK TWO VALUES

//======================================================
let makeLiveSync = (defaultValue, valA, valB) => {
  let isActive = ref(defaultValue);

  let toggle = () => {
    isActive.value = !isActive.value;
  };

  watch([isActive, () => ({ ...valB })], newVal => {
    if (isActive.value) {
      Object.keys(valB).map(key => {
        valA[key] = valB[key];
      });
    }
  });

  return {
    isActive,
    toggle };

};
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
let useTabset = tabLabels => {
  let tab = ref(0);
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


  let binaryLvlSearch = (array, target, getExp = x => x, getResult = x => x) => {
    target = parseFloat(target);
    target = isNaN(target) ? 0 : target;

    let startIndex = 0;
    let maxIndex = array.length - 1;
    let endIndex = maxIndex;
    if (target <= getExp(array[0])) {
      return array[0];
    } else {
      while (startIndex <= endIndex) {
        let middleIndex = Math.floor((startIndex + endIndex) / 2);
        let stepBeforeIndex = Math.max(0, middleIndex - 1);
        if (getExp(array[stepBeforeIndex]) <= target && target < getExp(array[middleIndex]))
        return getResult(array[stepBeforeIndex]);
        if (target > getExp(array[middleIndex]))
        startIndex = middleIndex + 1;
        if (target < getExp(array[middleIndex]))
        endIndex = middleIndex - 1;
        if (endIndex < startIndex)
        return getResult(array[maxIndex]);
      }
    }
  };

  let applyStats = (oldStats, newStats) => {
    let keys = Object.keys(newStats);
    keys.map(key => {
      oldStats[key] = newStats[key];
    });
    return oldStats;
  };


  let makeStats = (override = {}) => {
    return reactive({
      attack: 1,
      strength: 1,
      defence: 1,
      hitpoints: 10,
      prayer: 1,
      ranged: 1,
      magic: 1,
      ...override });

  };


  let levelToXp = level => {
    let lvlData = rsLevelsRaw.find(item => getRsLevel(item) === parseFloat(level));
    if (typeof lvlData !== 'undefined')
    return getRsExp(lvlData);
    return 1;
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

  let clampLevel = lvl => Math.min(Math.max(1, lvl), 99);


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



  return {
    sanitizeLevel,
    sanitizeExp,
    clampLevel,
    levelToXp,
    xpToLevel,
    applyStats,
    makeStats,
    convertStatLevelsToXp,
    convertStatXpToLevels,
    calculateTotalExp };

};


//======================================================

// Make Computed which syncs multiple converted values

//======================================================
let makeComputedConversionSync = (base, conversions) => {
  return computed({
    get() {
      return base.ref;
    },
    set(newVal) {
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
    localStorage.setItem('records', val);
  };

  onMounted(() => {
    loadRecords();
  });
  let addRecord = (name, config) => {
    records.value.push({
      name,
      config });

    saveRecords();
  };
  let removeRecord = i => {
    records.value.splice(i, 1);
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

  return {
    loadRecords,
    saveRecords,
    removeRecord,
    addRecord,
    records,
    prompt,
    input };

};







//======================================================

//                 STATS Component

//======================================================

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
      this.c_playerStats = temp;
    } },

  computed: {
    c_playerStats: {
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

    const playerStats = statUtils.makeStats();
    const playerExp = statUtils.makeStats(statUtils.convertStatLevelsToXp(playerStats));

    let c_playerExp;
    let c_playerStats;

    // Levels
    let base = {
      ref: playerStats,
      sanitize: statUtils.sanitizeLevel,
      apply: statUtils.applyStats };


    // Experiance
    let base2 = {
      ref: playerExp,
      sanitize: statUtils.sanitizeExp,
      apply: statUtils.applyStats };


    c_playerStats = makeComputedConversionSync(base, [
    { ...base2, convert: statUtils.levelToXp }]);


    c_playerExp = makeComputedConversionSync(base2, [
    { ...base, convert: statUtils.xpToLevel }]);





    //----------------------------------------------
    // Combat Calc
    function useCombatCalc(statUtils) {
      const stats = reactive({
        attack: 40,
        strength: 47,
        defence: 1,
        hitpoints: 44,
        prayer: 1,
        ranged: 47,
        magic: 44 });





      const lockedStats = reactive({
        attack: false,
        strength: false,
        defence: false,
        hitpoints: false,
        prayer: false,
        ranged: false,
        magic: false });






      let scaler = 0.325;


      // Close Range
      var meleeOffense = computed(() => (stats.attack + stats.strength) * scaler);

      let defWeight = computed(() => stats.defence + stats.hitpoints);
      let baseWeight = computed(() => (defWeight.value + Math.floor(stats.prayer / 2)) / 4);


      // Distance
      var rangeWeight = computed(() => Math.floor(stats.ranged * 1.5) * scaler);
      var mageWeight = computed(() => Math.floor(stats.magic * 1.5) * scaler);
      var distanceOffence = computed(() => Math.max(rangeWeight.value, mageWeight.value));

      var cmbLvl = computed(() => {
        var max = Math.max(meleeOffense.value, distanceOffence.value);
        var level = Math.round((baseWeight.value + max) * 100) / 100;
        return level;
      });



      //===========================================================

      // SYNC Methods to find maximal levels for combat level

      //===========================================================

      // Take ranged and mage and find meele stats which won't increase the combat lvl at all
      let syncMeeleToDistance = ref(false);
      watch(distanceOffence, (newVal, oldVal) => {
        if (syncMeeleToDistance.value && newVal != oldVal) {
          let delta = statUtils.clampLevel(distanceOffence.value / scaler - stats.attack);

          let numNotLocked = 0;
          if (!lockedStats.attack)
          ++numNotLocked;
          if (!lockedStats.strength)
          ++numNotLocked;

          if (numNotLocked == 2) {
            // Split required level between the two almost equally - favoring str
            let half = Math.ceil(delta / 2);
            stats.strength = half;
            stats.attack = delta - half;

          } else if (!lockedStats.attack) {
            stats.attack = delta;
          } else if (!lockedStats.strength) {
            stats.strength = delta;
          }

        }
      });

      // Take the meele stats and find the maximal ranged or mage level 
      const syncDistanceToMeele = ref(false);
      var distanceOffenceEquivalent = computed(() => statUtils.clampLevel(Math.floor(meleeOffense.value / scaler / 1.5)));
      watch([syncDistanceToMeele, meleeOffense, distanceOffenceEquivalent, () => lockedStats], (newVal, oldVal) => {
        if (syncDistanceToMeele.value && newVal && newVal !== oldVal) {
          stats.ranged = distanceOffenceEquivalent.value;
          stats.magic = distanceOffenceEquivalent.value;
        }
      });


      // Link range and magic together since only the highest one matters
      let linkedDistanceOffence = makeLinkedValueToggle(false, stats, 'magic', stats, 'ranged', 'max');



      // Toggle Sync methods
      watch([syncMeeleToDistance, () => lockedStats], (newVal, oldVal) => {
        if (syncMeeleToDistance.value)
        syncDistanceToMeele.value = !syncMeeleToDistance.value;
      });

      watch(syncDistanceToMeele, (newVal, oldVal) => {
        if (newVal)
        syncMeeleToDistance.value = !syncDistanceToMeele.value;
      });
      //-----------------------------------------------------------




      // Store the original values
      const oringinalStats = statUtils.makeStats({});


      // Action for "Use Stats"
      let applyStatsToCalc = newStats => {

        // Remove locks and linked values
        linkedDistanceOffence.isActive.value = false;
        syncMeeleToDistance.value = false;
        syncDistanceToMeele.value = false;
        Object.keys(lockedStats).map(key => {
          lockedStats[key] = false;
        });

        // Update stats
        statUtils.applyStats(stats, newStats);

        statUtils.applyStats(oringinalStats, newStats);
      };






      return {

        tabset: useTabset([
        { label: 'Level', key: 'lvl', icon: 'mdi-chart-bar' },
        { label: 'Experience', key: 'exp', icon: 'mdi-school' }]),


        // Sync modes
        syncMeeleToDistance,
        syncDistanceToMeele,

        oringinalStats,
        stats,
        lockedStats,

        cmbLvl,

        linkedDistanceOffence,
        distanceOffenceEquivalent,
        //distanceOffence,
        //meleeOffense,

        applyStatsToCalc

        //----------
      };
    }
    //----------------------------------------------



    //----------------------------------------------
    // Make Combat Calc
    var combatCalc = useCombatCalc(statUtils);
    //----------------------------------------------


    //----------------------------------------------
    // Make Radar Graph 
    let order = ['strength', 'attack', 'prayer', 'defence', 'hitpoints', 'magic', 'ranged'];
    let chartData = computed(() => {
      return {
        labels: order.map(item => _.upperFirst(item)),
        datasets: [
        {
          label: 'Stats',
          data: order.map(skill => combatCalc.stats[skill]) }] };



    });
    useRadarChart('myChart', chartData);
    //----------------------------------------------


    //----------------------------------------------
    // Tick Labels
    let useStatTickLabels = () => {
      let statTickLabels = reactive({
        attack: [],
        strength: [],
        defence: [],
        hitpoints: [],
        prayer: [],
        ranged: [],
        magic: [] });



      //let indicator = '⬤'; // used to maybe indicate the original level '↑' alt
      for (let i = 1; i <= 99; ++i) {

        let isNotch = i % 10 == 0;
        statTickLabels.attack.push(isNotch ? i : null);
        statTickLabels.strength.push(isNotch ? i : null);
        statTickLabels.defence.push(isNotch ? i : null);
        if (i >= 10)
        statTickLabels.hitpoints.push(isNotch ? i : null);
        statTickLabels.prayer.push(isNotch ? i : null);
        statTickLabels.ranged.push(isNotch ? i : null);
        statTickLabels.magic.push(isNotch ? i : null);
        /*
                                                       statTickLabels.attack.push([1, 40, 60, 70, 75, 80].includes(i) ? i : null);      
                                                       statTickLabels.strength.push([50, 60, 70, 75].includes(i) ? i : null);    
                                                       statTickLabels.defence.push([10, 40, 45, 50, 60, 70, 75, 80].includes(i) ? i : null);    
                                                       if(i >= 10)
                                                         statTickLabels.hitpoints.push([50].includes(i) ? i : null);    
                                                       statTickLabels.prayer.push([25, 43, 52, 74].includes(i) ? i : null);      
                                                       statTickLabels.ranged.push([40, 70, 75].includes(i) ? i : null);
                                                       statTickLabels.magic.push([35, 59, 75, 94].includes(i) ? i : null);
                                                       //*/
      }
      let showLabels = ref(false);

      return {
        showLabels,
        statTickLabels };

    };
    //----------------------------------------------



    // Make a toggle to sync the player stats to the calculator
    let liveStatSync = makeLiveSync(true, combatCalc.stats, playerStats);
    let { isActive: isLiveStatSync, toggle: toggleLiveStatSync } = liveStatSync;

    let storedStats = useSavableStats(playerStats);

    let skillIcons = useSkillIcons();


    let applyStatsToPlayer = newStats => {
      c_playerStats.value = newStats;
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
      return statUtils.calculateTotalExp(c_playerExp.value);
    });


    let log = (...a) => {console.log(...a);};
    return {
      playerStatsSidebar,
      cardStyle,

      log,

      // Icons
      lockIcon,
      checkIcon,
      skillIcons,

      // Stored presets
      accountConfigs,
      storedStats,
      playerStats,
      c_playerExp,
      playerExp,
      c_totalExp,
      c_playerStats,
      applyStatsToPlayer,

      // Sync stats to calc
      liveStatSync,

      // Combat Calculations
      combatCalc,
      ...useStatTickLabels() };

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