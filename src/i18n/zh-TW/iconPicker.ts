import type { iconPicker as en } from '../en/iconPicker';

export const iconPicker: typeof en = {
  // Search box
  searchIconsPlaceholder: '搜尋圖示…',
  searchEmojiPlaceholder: '搜尋表情符號…',

  // Icons / Emoji tabs
  iconsTab: '圖示',
  emojiTab: '表情符號',

  // Icon grid states
  loadingIcons: '正在載入圖示…',
  noIconsFound: '找不到圖示',
  noEmojiFound: '找不到表情符號',

  // Emoji category filter tooltips
  allCategories: '全部',
  emojiCategories: {
    smileysEmotion: '笑臉與情緒',
    peopleBody: '人物與身體',
    animalsNature: '動物與自然',
    foodDrink: '食物與飲料',
    travelPlaces: '旅遊與地點',
    activities: '活動',
    objects: '物品',
    symbols: '符號',
    flags: '旗幟',
  },

  // Color section
  selectColorAriaLabel: (colorName) => `選擇顏色：${colorName}`,
  hexPlaceholder: '#色碼',
  setCustomColor: '套用',

  // Preset pinned site color names
  colors: {
    gray: '灰色',
    red: '紅色',
    orange: '橘色',
    yellow: '黃色',
    green: '綠色',
    teal: '藍綠色',
    blue: '藍色',
    purple: '紫色',
    pink: '粉紅色',
  },
};
