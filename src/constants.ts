
import { CardData, Lesson } from './types';

// COMPLETE VOCABULARY MANIFEST (Lessons 1-6)
export const DECK_MANIFEST: CardData[] = [
    // --- SPECIAL GRAMMAR (Power Ups) ---
    { id: 'G-01', hanzi: '过', pinyin: 'guò', en: '(past tense)', type: 'grammar', tier: 'core' },
    { id: 'G-02', hanzi: '虽然', pinyin: 'suī rán', en: 'although', type: 'grammar', tier: 'core' },
    { id: 'G-03', hanzi: '但是', pinyin: 'dàn shì', en: 'but', type: 'grammar', tier: 'core' },

    // --- LESSON 1 ---
    { id: 'L1-01', hanzi: '好', pinyin: 'hǎo', en: 'good', type: 'adj', tier: 'core' },
    { id: 'L1-02', hanzi: '你', pinyin: 'nǐ', en: 'you', type: 'noun', tier: 'core' },
    { id: 'L1-03', hanzi: '我', pinyin: 'wǒ', en: 'I/me', type: 'noun', tier: 'core' },
    { id: 'L1-04', hanzi: '叫', pinyin: 'jiào', en: 'to be called', type: 'verb', tier: 'core' },
    { id: 'L1-05', hanzi: '什么', pinyin: 'shén me', en: 'what', type: 'grammar', tier: 'core' },
    { id: 'L1-06', hanzi: '名字', pinyin: 'míng zi', en: 'name', type: 'noun', tier: 'core' },
    { id: 'L1-07', hanzi: '姓', pinyin: 'xìng', en: 'surname', type: 'verb', tier: 'core' },
    { id: 'L1-08', hanzi: '贵', pinyin: 'guì', en: 'noble/expensive', type: 'adj', tier: 'core' },
    { id: 'L1-09', hanzi: '请', pinyin: 'qǐng', en: 'please/invite', type: 'verb', tier: 'core' },
    { id: 'L1-10', hanzi: '问', pinyin: 'wèn', en: 'ask', type: 'verb', tier: 'core' },
    { id: 'L1-11', hanzi: '王', pinyin: 'wáng', en: 'Wang (surname)', type: 'noun', tier: 'core' },
    { id: 'L1-12', hanzi: '李', pinyin: 'lǐ', en: 'Li (surname)', type: 'noun', tier: 'core' },
    { id: 'L1-13', hanzi: '小姐', pinyin: 'xiǎo jiě', en: 'Miss', type: 'noun', tier: 'core' },
    { id: 'L1-14', hanzi: '先生', pinyin: 'xiān sheng', en: 'Mr.', type: 'noun', tier: 'core' },
    { id: 'L1-15', hanzi: '呢', pinyin: 'ne', en: '(particle)', type: 'grammar', tier: 'core' },
    { id: 'L1-16', hanzi: '朋友', pinyin: 'péng you', en: 'friend', type: 'noun', tier: 'core' },
    { id: 'L1-17', hanzi: '中文', pinyin: 'zhōng wén', en: 'Chinese', type: 'noun', tier: 'core' },
    { id: 'L1-18', hanzi: '英文', pinyin: 'yīng wén', en: 'English', type: 'noun', tier: 'core' },
    { id: 'L1-19', hanzi: '不', pinyin: 'bù', en: 'not/no', type: 'grammar', tier: 'core' },
    { id: 'L1-20', hanzi: '是', pinyin: 'shì', en: 'is/am/are', type: 'verb', tier: 'core' },
    { id: 'L1-21', hanzi: '他', pinyin: 'tā', en: 'he', type: 'noun', tier: 'core' },
    { id: 'L1-22', hanzi: '她', pinyin: 'tā', en: 'she', type: 'noun', tier: 'core' },
    { id: 'L1-23', hanzi: '这', pinyin: 'zhè', en: 'this', type: 'noun', tier: 'core' },
    { id: 'L1-24', hanzi: '那', pinyin: 'nà', en: 'that', type: 'noun', tier: 'core' },
    { id: 'L1-25', hanzi: '也', pinyin: 'yě', en: 'also', type: 'grammar', tier: 'core' },
    { id: 'L1-26', hanzi: '老师', pinyin: 'lǎo shī', en: 'teacher', type: 'noun', tier: 'core' },
    { id: 'L1-27', hanzi: '学生', pinyin: 'xué sheng', en: 'student', type: 'noun', tier: 'core' },
    { id: 'L1-28', hanzi: '吗', pinyin: 'ma', en: '(question)', type: 'grammar', tier: 'core' },
    { id: 'L1-29', hanzi: '人', pinyin: 'rén', en: 'person', type: 'noun', tier: 'core' },
    { id: 'L1-30', hanzi: '中国', pinyin: 'zhōng guó', en: 'China', type: 'noun', tier: 'core' },
    { id: 'L1-31', hanzi: '北京', pinyin: 'běi jīng', en: 'Beijing', type: 'noun', tier: 'core' },
    { id: 'L1-32', hanzi: '住在', pinyin: 'zhù zài', en: 'live in', type: 'verb', tier: 'core' },
    { id: 'L1-33', hanzi: '美国', pinyin: 'měi guó', en: 'USA', type: 'noun', tier: 'core' },
    { id: 'L1-34', hanzi: '夏威夷', pinyin: 'xià wēi yí', en: 'Hawaii', type: 'noun', tier: 'core' },
    { id: 'L1-35', hanzi: '纽约', pinyin: 'niǔ yuē', en: 'New York', type: 'noun', tier: 'core' },

    // --- LESSON 2 ---
    { id: 'L2-01', hanzi: '我们', pinyin: 'wǒ men', en: 'we/us', type: 'noun', tier: 'core' },
    { id: 'L2-02', hanzi: '你们', pinyin: 'nǐ men', en: 'you (pl)', type: 'noun', tier: 'core' },
    { id: 'L2-03', hanzi: '他们', pinyin: 'tā men', en: 'they', type: 'noun', tier: 'core' },
    { id: 'L2-04', hanzi: '都', pinyin: 'dōu', en: 'all/both', type: 'grammar', tier: 'core' },
    { id: 'L2-05', hanzi: '说', pinyin: 'shuō', en: 'speak', type: 'verb', tier: 'core' },
    { id: 'L2-06', hanzi: '的', pinyin: 'de', en: '(possessive)', type: 'grammar', tier: 'core' },
    { id: 'L2-07', hanzi: '我的', pinyin: 'wǒ de', en: 'my', type: 'noun', tier: 'core' },
    { id: 'L2-08', hanzi: '你的', pinyin: 'nǐ de', en: 'your', type: 'noun', tier: 'core' },
    { id: 'L2-09', hanzi: '他的', pinyin: 'tā de', en: 'his', type: 'noun', tier: 'core' },
    { id: 'L2-10', hanzi: '有', pinyin: 'yǒu', en: 'have', type: 'verb', tier: 'core' },
    { id: 'L2-11', hanzi: '没有', pinyin: 'méi yǒu', en: 'not have', type: 'verb', tier: 'core' },
    { id: 'L2-12', hanzi: '和', pinyin: 'hé', en: 'and', type: 'grammar', tier: 'core' },
    { id: 'L2-13', hanzi: '想', pinyin: 'xiǎng', en: 'want/think', type: 'verb', tier: 'core' },
    { id: 'L2-14', hanzi: '喜欢', pinyin: 'xǐ huān', en: 'like', type: 'verb', tier: 'core' },
    { id: 'L2-15', hanzi: '爸爸', pinyin: 'bà ba', en: 'dad', type: 'noun', tier: 'core' },
    { id: 'L2-16', hanzi: '妈妈', pinyin: 'mā ma', en: 'mom', type: 'noun', tier: 'core' },
    { id: 'L2-17', hanzi: '姐姐', pinyin: 'jiě jie', en: 'older sister', type: 'noun', tier: 'core' },
    { id: 'L2-18', hanzi: '哥哥', pinyin: 'gē ge', en: 'older brother', type: 'noun', tier: 'core' },
    { id: 'L2-19', hanzi: '弟弟', pinyin: 'dì di', en: 'younger brother', type: 'noun', tier: 'core' },
    { id: 'L2-20', hanzi: '妹妹', pinyin: 'mèi mei', en: 'younger sister', type: 'noun', tier: 'core' },
    { id: 'L2-21', hanzi: '照片', pinyin: 'zhào piàn', en: 'photo', type: 'noun', tier: 'core' },
    { id: 'L2-22', hanzi: '个', pinyin: 'gè', en: '(measure word)', type: 'grammar', tier: 'core' },
    { id: 'L2-23', hanzi: '谁', pinyin: 'shéi', en: 'who', type: 'noun', tier: 'core' },
    { id: 'L2-24', hanzi: '家', pinyin: 'jiā', en: 'home/family', type: 'noun', tier: 'core' },
    { id: 'L2-25', hanzi: '几', pinyin: 'jǐ', en: 'how many', type: 'grammar', tier: 'core' },
    { id: 'L2-26', hanzi: '口', pinyin: 'kǒu', en: '(measure word)', type: 'grammar', tier: 'core' },
    { id: 'L2-27', hanzi: '两', pinyin: 'liǎng', en: 'two', type: 'noun', tier: 'core' },
    { id: 'L2-28', hanzi: '做', pinyin: 'zuò', en: 'do', type: 'verb', tier: 'core' },
    { id: 'L2-29', hanzi: '工作', pinyin: 'gōng zuò', en: 'work', type: 'verb', tier: 'core' },
    { id: 'L2-30', hanzi: '律师', pinyin: 'lǜ shī', en: 'lawyer', type: 'noun', tier: 'core' },
    { id: 'L2-31', hanzi: '医生', pinyin: 'yī shēng', en: 'doctor', type: 'noun', tier: 'core' },
    { id: 'L2-32', hanzi: '在', pinyin: 'zài', en: 'at/in', type: 'grammar', tier: 'core' },
    { id: 'L2-33', hanzi: '哪里', pinyin: 'nǎ lǐ', en: 'where', type: 'noun', tier: 'core' },
    { id: 'L2-34', hanzi: '为什么', pinyin: 'wèi shén me', en: 'why', type: 'grammar', tier: 'core' },
    { id: 'L2-35', hanzi: '因为', pinyin: 'yīn wèi', en: 'because', type: 'grammar', tier: 'core' },

    // --- LESSON 3 ---
    { id: 'L3-01', hanzi: '月', pinyin: 'yuè', en: 'month', type: 'noun', tier: 'core' },
    { id: 'L3-02', hanzi: '号', pinyin: 'hào', en: 'day/number', type: 'noun', tier: 'core' },
    { id: 'L3-03', hanzi: '星期', pinyin: 'xīng qī', en: 'week', type: 'noun', tier: 'core' },
    { id: 'L3-04', hanzi: '今天', pinyin: 'jīn tiān', en: 'today', type: 'noun', tier: 'core' },
    { id: 'L3-05', hanzi: '明天', pinyin: 'míng tiān', en: 'tomorrow', type: 'noun', tier: 'core' },
    { id: 'L3-06', hanzi: '昨天', pinyin: 'zuó tiān', en: 'yesterday', type: 'noun', tier: 'core' },
    { id: 'L3-07', hanzi: '现在', pinyin: 'xiàn zài', en: 'now', type: 'noun', tier: 'core' },
    { id: 'L3-08', hanzi: '点', pinyin: 'diǎn', en: 'o\'clock', type: 'noun', tier: 'core' },
    { id: 'L3-09', hanzi: '早上', pinyin: 'zǎo shang', en: 'morning', type: 'noun', tier: 'core' },
    { id: 'L3-10', hanzi: '晚上', pinyin: 'wǎn shang', en: 'evening', type: 'noun', tier: 'core' },
    { id: 'L3-11', hanzi: '生日', pinyin: 'shēng rì', en: 'birthday', type: 'noun', tier: 'core' },
    { id: 'L3-12', hanzi: '今年', pinyin: 'jīn nián', en: 'this year', type: 'noun', tier: 'core' },
    { id: 'L3-13', hanzi: '岁', pinyin: 'suì', en: 'years old', type: 'noun', tier: 'core' },
    { id: 'L3-14', hanzi: '要', pinyin: 'yào', en: 'want/will', type: 'verb', tier: 'core' },
    { id: 'L3-15', hanzi: '跟', pinyin: 'gēn', en: 'with', type: 'grammar', tier: 'core' },
    { id: 'L3-16', hanzi: '会', pinyin: 'huì', en: 'can/know how', type: 'verb', tier: 'core' },
    { id: 'L3-17', hanzi: '看', pinyin: 'kàn', en: 'look/watch', type: 'verb', tier: 'core' },
    { id: 'L3-18', hanzi: '去', pinyin: 'qù', en: 'go', type: 'verb', tier: 'core' },
    { id: 'L3-19', hanzi: '来', pinyin: 'lái', en: 'come', type: 'verb', tier: 'core' },
    { id: 'L3-20', hanzi: '可是', pinyin: 'kě shì', en: 'but', type: 'grammar', tier: 'core' },
    { id: 'L3-21', hanzi: '所以', pinyin: 'suǒ yǐ', en: 'so', type: 'grammar', tier: 'core' },
    { id: 'L3-22', hanzi: '可以', pinyin: 'kě yǐ', en: 'can/may', type: 'verb', tier: 'core' },
    { id: 'L3-23', hanzi: '怎么样', pinyin: 'zěn me yàng', en: 'how is it', type: 'grammar', tier: 'core' },
    { id: 'L3-24', hanzi: '爱', pinyin: 'ài', en: 'love', type: 'verb', tier: 'core' },
    { id: 'L3-25', hanzi: '再见', pinyin: 'zài jiàn', en: 'goodbye', type: 'verb', tier: 'core' },
    { id: 'L3-26', hanzi: '吃', pinyin: 'chī', en: 'eat', type: 'verb', tier: 'core' },
    { id: 'L3-27', hanzi: '饭', pinyin: 'fàn', en: 'meal/rice', type: 'noun', tier: 'core' },
    { id: 'L3-28', hanzi: '谢谢', pinyin: 'xiè xie', en: 'thanks', type: 'verb', tier: 'core' },
    { id: 'L3-29', hanzi: '参加', pinyin: 'cān jiā', en: 'participate', type: 'verb', tier: 'core' },
    { id: 'L3-30', hanzi: '很', pinyin: 'hěn', en: 'very', type: 'adj', tier: 'core' },
    { id: 'L3-31', hanzi: '高兴', pinyin: 'gāo xìng', en: 'happy', type: 'adj', tier: 'core' },
    { id: 'L3-32', hanzi: '还', pinyin: 'hái', en: 'still/also', type: 'grammar', tier: 'core' },
    { id: 'L3-33', hanzi: '学校', pinyin: 'xué xiào', en: 'school', type: 'noun', tier: 'core' },
    { id: 'L3-34', hanzi: '只', pinyin: 'zhǐ', en: 'only', type: 'grammar', tier: 'core' },
    { id: 'L3-35', hanzi: '菜', pinyin: 'cài', en: 'dish/cuisine', type: 'noun', tier: 'core' },

    // --- LESSON 4 ---
    { id: 'L4-01', hanzi: '周末', pinyin: 'zhōu mò', en: 'weekend', type: 'noun', tier: 'core' },
    { id: 'L4-02', hanzi: '常常', pinyin: 'cháng cháng', en: 'often', type: 'grammar', tier: 'core' },
    { id: 'L4-03', hanzi: '外国', pinyin: 'wài guó', en: 'foreign', type: 'noun', tier: 'core' },
    { id: 'L4-04', hanzi: '请客', pinyin: 'qǐng kè', en: 'treat (host)', type: 'verb', tier: 'core' },
    { id: 'L4-05', hanzi: '爱好', pinyin: 'ài hào', en: 'hobby', type: 'noun', tier: 'core' },
    { id: 'L4-06', hanzi: '东西', pinyin: 'dōng xi', en: 'things', type: 'noun', tier: 'core' },
    { id: 'L4-07', hanzi: '上网', pinyin: 'shàng wǎng', en: 'go online', type: 'verb', tier: 'core' },
    { id: 'L4-08', hanzi: '打球', pinyin: 'dǎ qiú', en: 'play ball', type: 'verb', tier: 'core' },
    { id: 'L4-09', hanzi: '电影', pinyin: 'diàn yǐng', en: 'movie', type: 'noun', tier: 'core' },
    { id: 'L4-10', hanzi: '唱歌', pinyin: 'chàng gē', en: 'sing', type: 'verb', tier: 'core' },
    { id: 'L4-11', hanzi: '听', pinyin: 'tīng', en: 'listen', type: 'verb', tier: 'core' },
    { id: 'L4-12', hanzi: '音乐', pinyin: 'yīn yuè', en: 'music', type: 'noun', tier: 'core' },
    { id: 'L4-13', hanzi: '有的', pinyin: 'yǒu de', en: 'some', type: 'noun', tier: 'core' },
    { id: 'L4-14', hanzi: '的时候', pinyin: 'de shí hou', en: 'when...', type: 'grammar', tier: 'core' },
    { id: 'L4-15', hanzi: '放学', pinyin: 'fàng xué', en: 'finish school', type: 'verb', tier: 'core' },
    { id: 'L4-16', hanzi: '好久', pinyin: 'hǎo jiǔ', en: 'long time', type: 'adj', tier: 'core' },
    { id: 'L4-17', hanzi: '不错', pinyin: 'bú cuò', en: 'not bad', type: 'adj', tier: 'core' },
    { id: 'L4-18', hanzi: '觉得', pinyin: 'jué de', en: 'think/feel', type: 'verb', tier: 'core' },
    { id: 'L4-19', hanzi: '有意思', pinyin: 'yǒu yì si', en: 'interesting', type: 'adj', tier: 'core' },
    { id: 'L4-20', hanzi: '睡觉', pinyin: 'shuì jiào', en: 'sleep', type: 'verb', tier: 'core' },
    { id: 'L4-21', hanzi: '算了', pinyin: 'suàn le', en: 'forget it', type: 'verb', tier: 'core' },
    { id: 'L4-22', hanzi: '找', pinyin: 'zhǎo', en: 'find', type: 'verb', tier: 'core' },
    { id: 'L4-23', hanzi: '别人', pinyin: 'bié rén', en: 'others', type: 'noun', tier: 'core' },

    // --- LESSON 5 ---
    { id: 'L5-01', hanzi: '快', pinyin: 'kuài', en: 'fast', type: 'adj', tier: 'core' },
    { id: 'L5-02', hanzi: '进来', pinyin: 'jìn lái', en: 'come in', type: 'verb', tier: 'core' },
    { id: 'L5-03', hanzi: '介绍', pinyin: 'jiè shào', en: 'introduce', type: 'verb', tier: 'core' },
    { id: 'L5-04', hanzi: '一下', pinyin: 'yí xià', en: 'a bit', type: 'grammar', tier: 'core' },
    { id: 'L5-05', hanzi: '喝', pinyin: 'hē', en: 'drink', type: 'verb', tier: 'core' },
    { id: 'L5-06', hanzi: '水', pinyin: 'shuǐ', en: 'water', type: 'noun', tier: 'core' },
    { id: 'L5-07', hanzi: '茶', pinyin: 'chá', en: 'tea', type: 'noun', tier: 'core' },
    { id: 'L5-08', hanzi: '咖啡', pinyin: 'kā fēi', en: 'coffee', type: 'noun', tier: 'core' },
    { id: 'L5-09', hanzi: '可乐', pinyin: 'kě lè', en: 'cola', type: 'noun', tier: 'core' },
    { id: 'L5-10', hanzi: '果汁', pinyin: 'guǒ zhī', en: 'juice', type: 'noun', tier: 'core' },
    { id: 'L5-11', hanzi: '带', pinyin: 'dài', en: 'bring', type: 'verb', tier: 'core' },
    { id: 'L5-12', hanzi: '漂亮', pinyin: 'piào liang', en: 'pretty', type: 'adj', tier: 'core' },
    { id: 'L5-13', hanzi: '帅', pinyin: 'shuài', en: 'handsome', type: 'adj', tier: 'core' },
    { id: 'L5-14', hanzi: '坐', pinyin: 'zuò', en: 'sit', type: 'verb', tier: 'core' },
    { id: 'L5-15', hanzi: '对不起', pinyin: 'duì bu qǐ', en: 'sorry', type: 'verb', tier: 'core' },
    { id: 'L5-16', hanzi: '吧', pinyin: 'ba', en: '(suggestion)', type: 'grammar', tier: 'core' },
    { id: 'L5-17', hanzi: '一起', pinyin: 'yì qǐ', en: 'together', type: 'grammar', tier: 'core' },
    { id: 'L5-18', hanzi: '聊天', pinyin: 'liáo tiān', en: 'chat', type: 'verb', tier: 'core' },
    { id: 'L5-19', hanzi: '才', pinyin: 'cái', en: 'only then', type: 'grammar', tier: 'core' },
    { id: 'L5-20', hanzi: '了', pinyin: 'le', en: '(particle)', type: 'grammar', tier: 'core' },
    { id: 'L5-21', hanzi: '给', pinyin: 'gěi', en: 'give/to', type: 'verb', tier: 'core' },

    // --- LESSON 6 ---
    { id: 'L6-01', hanzi: '最', pinyin: 'zuì', en: 'most', type: 'grammar', tier: 'core' },
    { id: 'L6-02', hanzi: '以后', pinyin: 'yǐ hòu', en: 'after', type: 'noun', tier: 'core' },
    { id: 'L6-03', hanzi: '以前', pinyin: 'yǐ qián', en: 'before', type: 'noun', tier: 'core' },
    { id: 'L6-04', hanzi: '不好意思', pinyin: 'bù hǎo yì si', en: 'embarrassed', type: 'adj', tier: 'core' },
    { id: 'L6-05', hanzi: '要是', pinyin: 'yào shi', en: 'if', type: 'grammar', tier: 'core' },
    { id: 'L6-06', hanzi: '电子邮件', pinyin: 'diàn zǐ yóu jiàn', en: 'email', type: 'noun', tier: 'core' },
    { id: 'L6-07', hanzi: '收到', pinyin: 'shōu dào', en: 'receive', type: 'verb', tier: 'core' },
    { id: 'L6-08', hanzi: '发', pinyin: 'fā', en: 'send', type: 'verb', tier: 'core' },
    { id: 'L6-09', hanzi: '写', pinyin: 'xiě', en: 'write', type: 'verb', tier: 'core' },
    { id: 'L6-10', hanzi: '就', pinyin: 'jiù', en: 'then/just', type: 'grammar', tier: 'core' },
    { id: 'L6-11', hanzi: '您', pinyin: 'nín', en: 'You (polite)', type: 'noun', tier: 'core' },
    { id: 'L6-12', hanzi: '打电话', pinyin: 'dǎ diàn huà', en: 'make call', type: 'verb', tier: 'core' },
    { id: 'L6-13', hanzi: '哪', pinyin: 'nǎ', en: 'which', type: 'grammar', tier: 'core' },
    { id: 'L6-14', hanzi: '位', pinyin: 'wèi', en: '(measure)', type: 'grammar', tier: 'core' },
    { id: 'L6-15', hanzi: '时间', pinyin: 'shí jiān', en: 'time', type: 'noun', tier: 'core' },
    { id: 'L6-16', hanzi: '开会', pinyin: 'kāi huì', en: 'meeting', type: 'verb', tier: 'core' },
    { id: 'L6-17', hanzi: '约时间', pinyin: 'yuē shí jiān', en: 'schedule', type: 'verb', tier: 'core' },
    { id: 'L6-18', hanzi: '手机', pinyin: 'shǒu jī', en: 'mobile', type: 'noun', tier: 'core' },
    { id: 'L6-19', hanzi: '考试', pinyin: 'kǎo shì', en: 'exam', type: 'noun', tier: 'core' },
    { id: 'L6-20', hanzi: '方便', pinyin: 'fāng biàn', en: 'convenient', type: 'adj', tier: 'core' },
    { id: 'L6-21', hanzi: '办公室', pinyin: 'bàn gōng shì', en: 'office', type: 'noun', tier: 'core' },
    { id: 'L6-22', hanzi: '等', pinyin: 'děng', en: 'wait', type: 'verb', tier: 'core' },
    { id: 'L6-23', hanzi: '别', pinyin: 'bié', en: 'don\'t', type: 'grammar', tier: 'core' },
    { id: 'L6-24', hanzi: '客气', pinyin: 'kè qi', en: 'polite', type: 'adj', tier: 'core' },
    { id: 'L6-25', hanzi: '帮', pinyin: 'bāng', en: 'help', type: 'verb', tier: 'core' },
    { id: 'L6-26', hanzi: '准备', pinyin: 'zhǔn bèi', en: 'prepare', type: 'verb', tier: 'core' },
    { id: 'L6-27', hanzi: '练习', pinyin: 'liàn xí', en: 'practice', type: 'verb', tier: 'core' },
    { id: 'L6-28', hanzi: '得', pinyin: 'děi', en: 'must', type: 'grammar', tier: 'core' },
    { id: 'L6-29', hanzi: '见面', pinyin: 'jiàn miàn', en: 'meet', type: 'verb', tier: 'core' },
    { id: 'L6-30', hanzi: '回来', pinyin: 'huí lái', en: 'come back', type: 'verb', tier: 'core' },
    { id: 'L6-31', hanzi: '应该', pinyin: 'yīng gāi', en: 'should', type: 'verb', tier: 'core' },
    { id: 'L6-32', hanzi: '怎么', pinyin: 'zěn me', en: 'how', type: 'grammar', tier: 'core' },

    // Wild (Purple)
    { id: 'w1', hanzi: '🀄', pinyin: 'Wild', en: 'Any', type: 'wild', tier: 'core' },
];

export const POWER_UP_IDS = [
    'L2-06', // 的 (de)
    'L5-20', // 了 (le)
    'L1-28', // 吗 (ma)
    'G-01',  // 过 (guo)
    'L2-35', // 因为 (yin wei)
    'L3-21', // 所以 (suo yi)
    'G-02',  // 虽然 (sui ran)
    'G-03'   // 但是 (dan shi)
];

// BASIC VOCAB SHELF (Core Verbs & Preps)
export const BASIC_SHELF_IDS = [
    'L1-20', // 是 (shi)
    'L2-32', // 在 (zai)
    'L3-14', // 要 (yao)
    'L2-13', // 想 (xiang)
    'L3-18', // 去 (qu)
    'L2-14', // 喜欢 (xi huan)
    'L2-10', // 有 (you)
    'L2-11'  // 没有 (mei you)
];

// Fisher-Yates Shuffle
const shuffleArray = (array: CardData[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Helper to shuffle and deal
export const generateDeck = (count: number = 40): CardData[] => {
    let deck: CardData[] = [];

    // Filter out cards that are permanently available on the shelves to avoid duplicates
    const availableCards = DECK_MANIFEST.filter(c => !BASIC_SHELF_IDS.includes(c.id));

    for (let i = 0; i < count; i++) {
        const template = availableCards[i % availableCards.length];
        deck.push({ ...template, id: `${template.id}-${Date.now()}-${i}` }); // Unique IDs
    }
    return shuffleArray(deck);
};

// LESSON DEFINITIONS
export const LESSONS: Lesson[] = [
    {
        id: 'L1',
        title: 'Basic Identity',
        description: 'Introducing yourself',
        vocabularyIds: ['L1-01', 'L1-02', 'L1-03', 'L1-04', 'L1-05', 'L1-06', 'L1-07', 'L1-08', 'L1-09', 'L1-10', 'L1-11', 'L1-12', 'L1-13', 'L1-14', 'L1-15', 'L1-16', 'L1-17', 'L1-18', 'L1-19', 'L1-20', 'L1-21', 'L1-22', 'L1-23', 'L1-24', 'L1-25', 'L1-26', 'L1-27', 'L1-28', 'L1-29', 'L1-30', 'L1-31', 'L1-32', 'L1-33', 'L1-34', 'L1-35', 'L2-06'],
        problems: [
            {
                id: 'L1-P1',
                prompt: 'Translate: "I am a teacher"',
                solutions: ['我是老师', '我是一个老师'],
                requiredCardIds: ['L1-03', 'L1-20', 'L1-26']
            },
            {
                id: 'L1-P2',
                prompt: 'Translate: "You are a student"',
                solutions: ['你是学生', '你是一个学生'],
                requiredCardIds: ['L1-02', 'L1-20', 'L1-27']
            },
            {
                id: 'L1-P3',
                prompt: 'Translate: "Is he your friend?"',
                solutions: ['他是你的朋友吗', '他是你朋友吗'],
                requiredCardIds: ['L1-21', 'L1-20', 'L1-02', 'L2-06', 'L1-16', 'L1-28']
            },
            {
                id: 'L1-P4',
                prompt: 'Translate: "I am not a teacher"',
                solutions: ['我不是老师'],
                requiredCardIds: ['L1-03', 'L1-19', 'L1-20', 'L1-26']
            },
            {
                id: 'L1-P5',
                prompt: 'Translate: "Are you American?"',
                solutions: ['你是美国人吗'],
                requiredCardIds: ['L1-02', 'L1-20', 'L1-33', 'L1-29', 'L1-28']
            },
            {
                id: 'L1-P6',
                prompt: 'Translate: "He lives in Beijing"',
                solutions: ['他住在北京'],
                requiredCardIds: ['L1-21', 'L1-32', 'L1-31']
            },
            {
                id: 'L1-P7',
                prompt: 'Translate: "What is her name?"',
                solutions: ['她叫什么名字'],
                requiredCardIds: ['L1-22', 'L1-04', 'L1-05', 'L1-06']
            },
            {
                id: 'L1-P8',
                prompt: 'Translate: "Are you Chinese?"',
                solutions: ['你是中国人吗'],
                requiredCardIds: ['L1-02', 'L1-20', 'L1-30', 'L1-29', 'L1-28']
            },
            {
                id: 'L1-P9',
                prompt: 'Translate: "Hello"',
                solutions: ['你好'],
                requiredCardIds: ['L1-02', 'L1-01']
            },
            {
                id: 'L1-P10',
                prompt: 'Translate: "My surname is Wang"',
                solutions: ['我姓王'],
                requiredCardIds: ['L1-03', 'L1-07', 'L1-11']
            },
            {
                id: 'L1-P11',
                prompt: 'Translate: "Is he a student?"',
                solutions: ['他是学生吗'],
                requiredCardIds: ['L1-21', 'L1-20', 'L1-27', 'L1-28']
            },
            {
                id: 'L1-P12',
                prompt: 'Translate: "I ask you"',
                solutions: ['我问你'],
                requiredCardIds: ['L1-03', 'L1-10', 'L1-02']
            },
            {
                id: 'L1-P13',
                prompt: 'Translate: "May I ask teacher?"',
                solutions: ['请问老师', '请问老师吗'],
                requiredCardIds: ['L1-09', 'L1-10', 'L1-26']
            },
            {
                id: 'L1-P14',
                prompt: 'Translate: "She is Teacher Li"',
                solutions: ['她是李老师'],
                requiredCardIds: ['L1-22', 'L1-20', 'L1-12', 'L1-26']
            },
            {
                id: 'L1-P15',
                prompt: 'Translate: "Are you a teacher?"',
                solutions: ['你是老师吗', '你是一个老师吗'],
                requiredCardIds: ['L1-02', 'L1-20', 'L1-26', 'L1-28']
            },
            {
                id: 'L1-P16',
                prompt: 'Translate: "I am not a student"',
                solutions: ['我不是学生'],
                requiredCardIds: ['L1-03', 'L1-19', 'L1-20', 'L1-27']
            },
            {
                id: 'L1-P17',
                prompt: 'Translate: "Is she your friend?"',
                solutions: ['她是你的朋友吗', '她是你朋友吗'],
                requiredCardIds: ['L1-22', 'L1-20', 'L1-02', 'L2-06', 'L1-16', 'L1-28']
            },
            {
                id: 'L1-P18',
                prompt: 'Translate: "Do you live in New York?"',
                solutions: ['你住在纽约吗'],
                requiredCardIds: ['L1-02', 'L1-32', 'L1-35', 'L1-28']
            },
            {
                id: 'L1-P19',
                prompt: 'Translate: "He is Chinese"',
                solutions: ['他是中国人'],
                requiredCardIds: ['L1-21', 'L1-20', 'L1-30', 'L1-29']
            },
            {
                id: 'L1-P20',
                prompt: 'Translate: "Are you Miss Wang?"',
                solutions: ['你是王小姐吗'],
                requiredCardIds: ['L1-02', 'L1-20', 'L1-11', 'L1-13', 'L1-28']
            }
        ]
    },
    {
        id: 'L2',
        title: 'Likes & Dislikes',
        description: 'Expressing preferences',
        vocabularyIds: ['L2-01', 'L2-02', 'L2-03', 'L2-04', 'L2-05', 'L2-06', 'L2-07', 'L2-08', 'L2-09', 'L2-10', 'L2-11', 'L2-12', 'L2-13', 'L2-14', 'L2-15', 'L2-16', 'L2-17', 'L2-18', 'L2-19', 'L2-20', 'L2-21', 'L2-22', 'L2-23', 'L2-24', 'L2-25', 'L2-26', 'L2-27', 'L2-28', 'L2-29', 'L2-30', 'L2-31', 'L2-32', 'L2-33', 'L2-34', 'L2-35'],
        problems: [
            {
                id: 'L2-P1',
                prompt: 'Translate: "I like Chinese food"',
                solutions: ['我喜欢中国菜', '我喜欢吃中国菜', '我喜欢中国饭', '我喜欢吃中国饭'],
                requiredCardIds: ['L1-03', 'L2-14', 'L1-30', 'L3-27', 'L3-35']
            },
            {
                id: 'L2-P2',
                prompt: 'Translate: "I do not like exams"',
                solutions: ['我不喜欢考试'],
                requiredCardIds: ['L1-03', 'L1-19', 'L2-14', 'L6-19']
            },
            {
                id: 'L2-P3',
                prompt: 'Translate: "We all like him"',
                solutions: ['我们都喜欢他'],
                requiredCardIds: ['L2-01', 'L2-04', 'L2-14', 'L1-21']
            },
            {
                id: 'L2-P4',
                prompt: 'Translate: "I do not have a brother"',
                solutions: ['我没有哥哥', '我没有弟弟'],
                requiredCardIds: ['L1-03', 'L2-11', 'L2-18']
            },
            {
                id: 'L2-P5',
                prompt: 'Translate: "My dad is a doctor"',
                solutions: ['我爸爸是医生', '我的爸爸是医生'],
                requiredCardIds: ['L1-03', 'L2-15', 'L1-20', 'L2-31']
            },
            {
                id: 'L2-P6',
                prompt: 'Translate: "She likes to work"',
                solutions: ['她喜欢工作'],
                requiredCardIds: ['L1-22', 'L2-14', 'L2-29']
            },
            {
                id: 'L2-P7',
                prompt: 'Translate: "We are all friends"',
                solutions: ['我们都是朋友'],
                requiredCardIds: ['L2-01', 'L2-04', 'L1-20', 'L1-16']
            },
            {
                id: 'L2-P8',
                prompt: 'Translate: "Whose photo is this?"',
                solutions: ['这是谁的照片'],
                requiredCardIds: ['L1-23', 'L1-20', 'L2-23', 'L2-06', 'L2-21']
            },
            {
                id: 'L2-P9',
                prompt: 'Translate: "How many people in your family?"',
                solutions: ['你家有几口人'],
                requiredCardIds: ['L1-02', 'L2-24', 'L2-10', 'L2-25', 'L2-26', 'L1-29']
            },
            {
                id: 'L2-P10',
                prompt: 'Translate: "What do you want to do?"',
                solutions: ['你想做什么'],
                requiredCardIds: ['L1-02', 'L2-13', 'L2-28', 'L1-05']
            },
            {
                id: 'L2-P11',
                prompt: 'Translate: "I am not a lawyer"',
                solutions: ['我不是律师'],
                requiredCardIds: ['L1-03', 'L1-19', 'L1-20', 'L2-30']
            },
            {
                id: 'L2-P12',
                prompt: 'Translate: "Do you like him?"',
                solutions: ['你喜欢他吗'],
                requiredCardIds: ['L1-02', 'L2-14', 'L1-21', 'L1-28']
            },
            {
                id: 'L2-P13',
                prompt: 'Translate: "Because I like Chinese"',
                solutions: ['因为我喜欢中文'],
                requiredCardIds: ['L2-35', 'L1-03', 'L2-14', 'L1-17']
            },
            {
                id: 'L2-P14',
                prompt: 'Translate: "Who is she?"',
                solutions: ['她是谁'],
                requiredCardIds: ['L1-22', 'L1-20', 'L2-23']
            },
            {
                id: 'L2-P15',
                prompt: 'Translate: "Does he have a younger brother?"',
                solutions: ['他有弟弟吗'],
                requiredCardIds: ['L1-21', 'L2-10', 'L2-19', 'L1-28']
            },
            {
                id: 'L2-P16',
                prompt: 'Translate: "We do not have photos"',
                solutions: ['我们没有照片'],
                requiredCardIds: ['L2-01', 'L2-11', 'L2-21']
            },
            {
                id: 'L2-P17',
                prompt: 'Translate: "My older sister is a doctor"',
                solutions: ['我姐姐是医生', '我的姐姐是医生'],
                requiredCardIds: ['L1-03', 'L2-17', 'L1-20', 'L2-31']
            },
            {
                id: 'L2-P18',
                prompt: 'Translate: "I want to be a lawyer"',
                solutions: ['我想做律师'],
                requiredCardIds: ['L1-03', 'L2-13', 'L2-28', 'L2-30']
            },
            {
                id: 'L2-P19',
                prompt: 'Translate: "Where does he work?"',
                solutions: ['他在哪里工作'],
                requiredCardIds: ['L1-21', 'L2-32', 'L2-33', 'L2-29']
            },
            {
                id: 'L2-P20',
                prompt: 'Translate: "They are all students"',
                solutions: ['他们都是学生'],
                requiredCardIds: ['L2-03', 'L2-04', 'L1-20', 'L1-27']
            }
        ]
    },
    {
        id: 'L3',
        title: 'Making Plans',
        description: 'Time and arrangements',
        vocabularyIds: ['L3-01', 'L3-02', 'L3-03', 'L3-04', 'L3-05', 'L3-06', 'L3-07', 'L3-08', 'L3-09', 'L3-10', 'L3-11', 'L3-12', 'L3-13', 'L3-14', 'L3-15', 'L3-16', 'L3-17', 'L3-18', 'L3-19', 'L3-20', 'L3-21', 'L3-22', 'L3-23', 'L3-24', 'L3-25', 'L3-26', 'L3-27', 'L3-28', 'L3-29', 'L3-30', 'L3-31', 'L3-32', 'L3-33', 'L3-34', 'L3-35'],
        problems: [
            {
                id: 'L3-P1',
                prompt: 'Translate: "Tomorrow evening"',
                solutions: ['明天晚上'],
                requiredCardIds: ['L3-05', 'L3-10']
            },
            {
                id: 'L3-P2',
                prompt: 'Translate: "I treat (pay for meal)"',
                solutions: ['我请客'],
                requiredCardIds: ['L1-03', 'L4-04']
            },
            {
                id: 'L3-P3',
                prompt: 'Translate: "Tomorrow evening I treat"',
                solutions: ['明天晚上我请客'],
                requiredCardIds: ['L3-05', 'L3-10', 'L1-03', 'L4-04']
            },
            {
                id: 'L3-P4',
                prompt: 'Translate: "What time is it now?"',
                solutions: ['现在几点'],
                requiredCardIds: ['L3-07', 'L2-25', 'L3-08']
            },
            {
                id: 'L3-P5',
                prompt: 'Translate: "I go to Beijing tomorrow"',
                solutions: ['我明天去北京', '明天我去北京'],
                requiredCardIds: ['L1-03', 'L3-05', 'L3-18', 'L1-31']
            },
            {
                id: 'L3-P6',
                prompt: 'Translate: "I like to eat Chinese food"',
                solutions: ['我喜欢吃中国菜', '我喜欢吃中国饭'],
                requiredCardIds: ['L1-03', 'L2-14', 'L3-26', 'L1-30', 'L3-27', 'L3-35']
            },
            {
                id: 'L3-P7',
                prompt: 'Translate: "Is Chinese food tasty?"',
                solutions: ['中国菜好吃吗', '中国饭好吃吗'],
                requiredCardIds: ['L1-30', 'L3-27', 'L3-35', 'L1-01', 'L3-26', 'L1-28']
            },
            {
                id: 'L3-P8',
                prompt: 'Translate: "Today is not my birthday"',
                solutions: ['今天不是我的生日'],
                requiredCardIds: ['L3-04', 'L1-19', 'L1-20', 'L2-07', 'L3-11']
            },
            {
                id: 'L3-P9',
                prompt: 'Translate: "Do you like watching movies?"',
                solutions: ['你喜欢看电影吗'],
                requiredCardIds: ['L1-02', 'L2-14', 'L3-17', 'L4-09', 'L1-28']
            },
            {
                id: 'L3-P10',
                prompt: 'Translate: "I go to school"',
                solutions: ['我去学校'],
                requiredCardIds: ['L1-03', 'L3-18', 'L3-33']
            },
            {
                id: 'L3-P11',
                prompt: 'Translate: "Thank you teacher"',
                solutions: ['谢谢老师'],
                requiredCardIds: ['L3-28', 'L1-26']
            },
            {
                id: 'L3-P12',
                prompt: 'Translate: "I am very happy"',
                solutions: ['我很高兴'],
                requiredCardIds: ['L1-03', 'L3-30', 'L3-31']
            },
            {
                id: 'L3-P13',
                prompt: 'Translate: "Come to my home"',
                solutions: ['来我家'],
                requiredCardIds: ['L3-19', 'L1-03', 'L2-24']
            },
            {
                id: 'L3-P14',
                prompt: 'Translate: "I go to see a friend"',
                solutions: ['我去看朋友'],
                requiredCardIds: ['L1-03', 'L3-18', 'L3-17', 'L1-16']
            },
            {
                id: 'L3-P15',
                prompt: 'Translate: "Do you want to eat Chinese food?"',
                solutions: ['你要吃中国饭吗', '你要吃中国菜吗'],
                requiredCardIds: ['L1-02', 'L3-14', 'L3-26', 'L1-30', 'L3-27', 'L3-35', 'L1-28']
            },
            {
                id: 'L3-P16',
                prompt: 'Translate: "Is tomorrow your birthday?"',
                solutions: ['明天是你的生日吗'],
                requiredCardIds: ['L3-05', 'L1-20', 'L1-02', 'L2-06', 'L3-11', 'L1-28']
            },
            {
                id: 'L3-P17',
                prompt: 'Translate: "Goodbye"',
                solutions: ['再见'],
                requiredCardIds: ['L3-25']
            },
            {
                id: 'L3-P18',
                prompt: 'Translate: "I am very good"',
                solutions: ['我很好'],
                requiredCardIds: ['L1-03', 'L3-30', 'L1-01']
            },
            {
                id: 'L3-P19',
                prompt: 'Translate: "Do you like school?"',
                solutions: ['你喜欢学校吗'],
                requiredCardIds: ['L1-02', 'L2-14', 'L3-33', 'L1-28']
            },
            {
                id: 'L3-P20',
                prompt: 'Translate: "I like to eat rice"',
                solutions: ['我喜欢吃饭'],
                requiredCardIds: ['L1-03', 'L2-14', 'L3-26', 'L3-27']
            }
        ]
    }
];
