const { ref, computed, watch, onMounted, reactive } = window.vueCompositionApi;

Vue.config.productionTip = false;
Vue.use(vueCompositionApi.default);




//======================================================

//                    RUNESCAPE DATA

//======================================================
let rsLevelsRaw = [
[1, 0, 83], [2, 83, 91], [3, 174, 102], [4, 276, 112], [5, 388, 124], [6, 512, 138], [7, 650, 151], [8, 801, 168], [9, 969, 185], [10, 1154, 204], [11, 1358, 226], [12, 1584, 249], [13, 1833, 274], [14, 2107, 304], [15, 2411, 335], [16, 2746, 369], [17, 3115, 408], [18, 3523, 450], [19, 3973, 497], [20, 4470, 548], [21, 5018, 606], [22, 5624, 667], [23, 6291, 737], [24, 7028, 814], [25, 7842, 898], [26, 8740, 990], [27, 9730, 1094], [28, 10824, 1207], [29, 12031, 1332], [30, 13363, 1470], [31, 14833, 1623], [32, 16456, 1791], [33, 18247, 1977], [34, 20224, 2182], [35, 22406, 2409], [36, 24815, 2658], [37, 27473, 2935], [38, 30408, 3240], [39, 33648, 3576], [40, 37224, 3947], [41, 41171, 4358], [42, 45529, 4810], [43, 50339, 5310], [44, 55649, 5863], [45, 61512, 6471], [46, 67983, 7144], [47, 75127, 7887], [48, 83014, 8707], [49, 91721, 9612], [50, 101333, 10612], [51, 111945, 11715], [52, 123660, 12934], [53, 136594, 14278], [54, 150872, 15764], [55, 166636, 17404], [56, 184040, 19214], [57, 203254, 21212], [58, 224466, 23420], [59, 247886, 25856], [60, 273742, 28546], [61, 302288, 31516], [62, 333804, 34795], [63, 368599, 38416], [64, 407015, 42413], [65, 449428, 46826], [66, 496254, 51699], [67, 547953, 57079], [68, 605032, 63019], [69, 668051, 69576], [70, 737627, 76818], [71, 814445, 84812], [72, 899257, 93638], [73, 992895, 103383], [74, 1096278, 114143], [75, 1210421, 126022], [76, 1336443, 139138], [77, 1475581, 153619], [78, 1629200, 169608], [79, 1798808, 187260], [80, 1986068, 206750], [81, 2192818, 228269], [82, 2421087, 252027], [83, 2673114, 278259], [84, 2951373, 307221], [85, 3258594, 339198], [86, 3597792, 374502], [87, 3972294, 413482], [88, 4385776, 456519], [89, 4842295, 504037], [90, 5346332, 556499], [91, 5902831, 614422], [92, 6517253, 678376], [93, 7195629, 748985], [94, 7944614, 826944], [95, 8771558, 913019], [96, 9684577, 1008052], [97, 10692629, 1112977], [98, 11805606, 1228825], [99, 13034431, 0]];


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






//======================================================

//                    RADAR CHART

//======================================================
let makeRadarChart = (chartId, chartData) => {
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
    watch(chartData, (newVal, oldVal) => {
      if (newVal) {
        console.log('updated playerStats');
        playerChart.data = chartData.value;
        playerChart.update();
      }
    });
  });
};





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




//======================================================

//                 STATS INPUT

//======================================================
let playerStats = {
  template: '#stat-input',
  props: ['playerStats'] };



new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  components: {
    'player-stats': playerStats },

  setup() {


    // Icon methods
    let lockIcon = val => val ? 'mdi-lock' : 'mdi-lock-open-variant-outline';
    let checkIcon = val => val ? 'mdi-check-bold' : 'mdi-close';


    const playerStats = reactive({
      attack: 40,
      strength: 47,
      defence: 1,
      hitpoints: 44,
      prayer: 1,
      ranged: 58,
      magic: 58 });



    let applyStatsToPlayer = newStats => {
      playerStats.attack = newStats.attack;
      playerStats.strength = newStats.strength;
      playerStats.defence = newStats.defence;
      playerStats.hitpoints = newStats.hitpoints;
      playerStats.prayer = newStats.prayer;
      playerStats.ranged = newStats.ranged;
      playerStats.magic = newStats.magic;
    };


    //----------------------------------------------
    // Combat Calc
    function makeCombatCalc() {

      let levelToXp = level => {
        let lvlData = rsLevelsRaw.find(item => item[0] === level);
        if (typeof lvlData !== 'undefined')
        return lvlData[1];
        return 1;
      };


      let xpToLevel = xp => {
        let level = 1;
        for (const lvlData of rsLevelsRaw) {
          let [lvl, exp, delta] = lvlData;
          if (exp <= xp)
          level = lvl;else

          break;
        }
        return level;
      };

      const stats = reactive({
        attack: 40,
        strength: 47,
        defence: 1,
        hitpoints: 44,
        prayer: 1,
        ranged: 47,
        magic: 44 });


      // Exp the player has for xp
      const statExp = reactive({
        attack: levelToXp(stats.attack),
        strength: levelToXp(stats.strength),
        defence: levelToXp(stats.defence),
        hitpoints: levelToXp(stats.hitpoints),
        prayer: levelToXp(stats.prayer),
        ranged: levelToXp(stats.ranged),
        magic: levelToXp(stats.magic) });


      const lockedStats = reactive({
        attack: false,
        strength: false,
        defence: false,
        hitpoints: false,
        prayer: false,
        ranged: false,
        magic: false });



      let scaler = 0.325;





      let clampLevel = lvl => Math.min(Math.max(1, lvl), 99);


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


      // Take ranged and mage and find meele stats which dont increase the combat lvl
      let syncMeeleToDistance = ref(false);
      watch(distanceOffence, (newVal, oldVal) => {
        if (syncMeeleToDistance.value && newVal != oldVal) {
          let delta = clampLevel(distanceOffence.value / scaler - stats.attack);

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




      // Scale distance offence skills with meele
      const syncDistanceToMeele = ref(false);
      var distanceOffenceEquivalent = computed(() => clampLevel(Math.floor(meleeOffense.value / scaler / 1.5)));
      watch([syncDistanceToMeele, meleeOffense, distanceOffenceEquivalent, () => lockedStats], (newVal, oldVal) => {
        if (syncDistanceToMeele.value && newVal && newVal !== oldVal) {
          stats.ranged = distanceOffenceEquivalent.value;
          stats.magic = distanceOffenceEquivalent.value;
        }
      });



      let { isActive: linkDistance, toggle: toggleLinkDistance } = makeLinkedValueToggle(false, stats, 'magic', stats, 'ranged', 'max');



      // Toggle Sync methods
      watch([syncMeeleToDistance, () => lockedStats], (newVal, oldVal) => {
        if (syncMeeleToDistance.value)
        syncDistanceToMeele.value = !syncMeeleToDistance.value;
      });

      watch(syncDistanceToMeele, (newVal, oldVal) => {
        if (newVal)
        syncMeeleToDistance.value = !syncDistanceToMeele.value;
      });
      //----------------------------




      let applyStatsToCalc = newStats => {

        // Remove locks and linked values
        linkDistance.value = false;
        syncMeeleToDistance.value = false;
        syncDistanceToMeele.value = false;
        Object.keys(lockedStats).map(key => {
          lockedStats[key] = false;
        });

        // Update stats
        stats.attack = newStats.attack;
        stats.strength = newStats.strength;
        stats.defence = newStats.defence;
        stats.hitpoints = newStats.hitpoints;
        stats.prayer = newStats.prayer;
        stats.ranged = newStats.ranged;
        stats.magic = newStats.magic;
      };


      return {



        // Sync modes
        syncMeeleToDistance,
        syncDistanceToMeele,

        stats,
        lockedStats,

        cmbLvl,
        linkDistance,
        toggleLinkDistance,

        distanceOffenceEquivalent,
        distanceOffence,
        meleeOffense,

        applyStatsToCalc,

        xpToLevel,
        levelToXp

        //----------
      };
    }
    //----------------------------------------------



    //----------------------------------------------
    // Make Combat Calc
    var combatCalc = makeCombatCalc();
    //----------------------------------------------


    //----------------------------------------------
    // Make Radar Graph 
    let order = ['strength', 'attack', 'prayer', 'defence', 'hitpoints', 'magic', 'ranged'];
    let chartData = computed(() => {
      return {
        labels: order,
        datasets: [
        {
          label: 'Stats',
          data: order.map(skill => combatCalc.stats[skill]) }] };



    });
    makeRadarChart('myChart', chartData);
    //----------------------------------------------


    //----------------------------------------------
    // Tick Labels
    let makeTickLabels = () => {
      let statTickLabels = reactive({
        attack: [],
        strength: [],
        defence: [],
        hitpoints: [],
        prayer: [],
        ranged: [],
        magic: [] });

      let standardLvls = [1, 40, 60, 70];
      let tickLabels = [];
      for (let i = 1; i <= 99; ++i) {
        //*
        tickLabels.push(standardLvls.includes(i) ? i : null);

        statTickLabels.attack.push(standardLvls.includes(i) ? i : null);
        statTickLabels.strength.push([50, 60, 70, 75].includes(i) ? i : null);
        statTickLabels.defence.push([10, 40, 45, 50, 60, 70, 75, 80].includes(i) ? i : null);
        if (i >= 10)
        statTickLabels.hitpoints.push([50].includes(i) ? i : null);
        statTickLabels.prayer.push([25, 43, 52, 74].includes(i) ? i : null);
        statTickLabels.ranged.push([40, 70, 75].includes(i) ? i : null);
        statTickLabels.magic.push([35, 59, 75, 94].includes(i) ? i : null);
        //*/
      }
      let showLabels = ref(false);

      return {
        showLabels,
        statTickLabels,
        tickLabels };

    };
    //----------------------------------------------



    // Make a toggle to sync the player stats to the calculator
    let { isActive: isLiveStatSync, toggle: toggleLiveStatSync } = makeLiveSync(true, combatCalc.stats, playerStats);



    return {

      lockIcon,
      checkIcon,

      accountConfigs,
      playerStats,
      applyStatsToPlayer,

      isLiveStatSync,
      toggleLiveStatSync,

      ...combatCalc,
      ...makeTickLabels() };

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