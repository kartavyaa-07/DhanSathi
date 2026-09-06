// Seed data ported verbatim from the DhanSathi Claude Design prototype
// (DhanSathi.dc.html / DhanSathi Desktop.dc.html — data-dc-script block).

export interface Scheme {
  id: string;
  nameEn: string;
  nameHi: string;
  fullNameEn: string;
  fullNameHi: string;
  category: string;
  categoryHi: string;
  premiumEn: string;
  premiumHi: string;
  coverEn: string;
  coverHi: string;
  cover: string;
  premium: string;
  payEn: string;
  payHi: string;
  getEn: string;
  getHi: string;
  exitEn: string;
  exitHi: string;
  lockIn: string;
  lockInHi: string;
  time: string;
  timeHi: string;
  officialUrl: string;
}

export const SCHEMES: Scheme[] = [
  {
    id: 'pmsby', nameEn: 'PMSBY', nameHi: 'प्रधानमंत्री सुरक्षा बीमा योजना',
    fullNameEn: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)', fullNameHi: 'प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)',
    category: 'Accident', categoryHi: 'दुर्घटना',
    premiumEn: '₹20/year', premiumHi: '₹20 प्रति साल',
    coverEn: '₹2 lakh accidental death & disability cover', coverHi: 'दुर्घटना में मृत्यु और विकलांगता पर ₹2 लाख का कवर',
    cover: '₹2,00,000', premium: '₹20/year',
    payEn: '₹20 is auto-debited once a year from your linked bank account, every June 1st. That is about ₹1.7 per month.',
    payHi: 'हर साल 1 जून को आपके जुड़े बैंक खाते से ₹20 अपने आप कट जाते हैं। यानी करीब ₹1.7 प्रति महीना।',
    getEn: '₹2 lakh if death or full disability from an accident. ₹1 lakh for partial disability. No hospital bills needed to claim — just an accident report.',
    getHi: 'दुर्घटना में मृत्यु या पूरी विकलांगता पर ₹2 लाख। आंशिक विकलांगता पर ₹1 लाख। क्लेम के लिए अस्पताल के बिल नहीं चाहिए — सिर्फ दुर्घटना की रिपोर्ट।',
    exitEn: 'Cancel anytime by telling your bank to stop the auto-debit. No penalty, no paperwork, nothing to return.',
    exitHi: 'बैंक को ऑटो-डेबिट रोकने के लिए कहकर कभी भी बंद कर सकते हैं। कोई जुर्माना नहीं, कोई कागज़ी कार्रवाई नहीं।',
    lockIn: 'None', lockInHi: 'कोई नहीं', time: '~5 min', timeHi: '~5 मिनट',
    officialUrl: 'https://www.jansuraksha.gov.in',
  },
  {
    id: 'pmjjby', nameEn: 'PMJJBY', nameHi: 'प्रधानमंत्री जीवन ज्योति बीमा योजना',
    fullNameEn: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)', fullNameHi: 'प्रधानमंत्री जीवन ज्योति बीमा योजना (PMJJBY)',
    category: 'Life', categoryHi: 'जीवन',
    premiumEn: '₹436/year', premiumHi: '₹436 प्रति साल',
    coverEn: '₹2 lakh life cover for your family', coverHi: 'आपके परिवार के लिए ₹2 लाख का जीवन बीमा',
    cover: '₹2,00,000', premium: '₹436/year',
    payEn: '₹436 is auto-debited once a year from your linked bank account, every June 1st. That is under ₹37 per month.',
    payHi: 'हर साल 1 जून को आपके जुड़े बैंक खाते से ₹436 अपने आप कट जाते हैं। यानी ₹37 प्रति महीने से भी कम।',
    getEn: 'Your family receives ₹2 lakh if something happens to you, for any reason. Paid directly to your nominee within 30 days.',
    getHi: 'किसी भी कारण से आपको कुछ हो जाए तो आपके परिवार को ₹2 लाख मिलते हैं। सीधे आपके नॉमिनी को 30 दिन के भीतर।',
    exitEn: 'Cancel anytime by telling your bank to stop the auto-debit. No penalty.',
    exitHi: 'बैंक को ऑटो-डेबिट रोकने के लिए कहकर कभी भी बंद कर सकते हैं। कोई जुर्माना नहीं।',
    lockIn: 'None', lockInHi: 'कोई नहीं', time: '~7 min', timeHi: '~7 मिनट',
    officialUrl: 'https://www.jansuraksha.gov.in',
  },
  {
    id: 'pmjay', nameEn: 'PM-JAY (Ayushman Bharat)', nameHi: 'प्रधानमंत्री जन आरोग्य योजना',
    fullNameEn: 'Pradhan Mantri Jan Arogya Yojana (Ayushman Bharat)', fullNameHi: 'प्रधानमंत्री जन आरोग्य योजना (आयुष्मान भारत)',
    category: 'Health', categoryHi: 'स्वास्थ्य',
    premiumEn: 'Free', premiumHi: 'मुफ़्त',
    coverEn: '₹5 lakh/family/year hospital cover', coverHi: 'हर परिवार को हर साल ₹5 लाख का अस्पताल कवर',
    cover: '₹5,00,000/year', premium: 'Free (Govt. funded)',
    payEn: 'This scheme is free. The government pays the full premium for eligible families — you pay nothing.',
    payHi: 'यह योजना मुफ़्त है। पात्र परिवारों का पूरा प्रीमियम सरकार भरती है — आपको कुछ नहीं देना।',
    getEn: '₹5 lakh per family per year for hospital treatment, at any listed government or private hospital. Cashless — no bills to pay upfront.',
    getHi: 'हर परिवार को हर साल ₹5 लाख तक का इलाज, किसी भी सूचीबद्ध सरकारी या प्राइवेट अस्पताल में। कैशलेस — पहले से कोई बिल नहीं भरना।',
    exitEn: 'No enrollment to exit — coverage renews automatically every year as long as you remain eligible.',
    exitHi: 'बाहर निकलने की कोई प्रक्रिया नहीं — जब तक आप पात्र हैं, कवर हर साल अपने आप चलता रहता है।',
    lockIn: 'None', lockInHi: 'कोई नहीं', time: '~10 min', timeHi: '~10 मिनट',
    officialUrl: 'https://pmjay.gov.in',
  },
  {
    id: 'hospicash', nameEn: 'Hospi-Cash', nameHi: 'हॉस्पि-कैश योजना',
    fullNameEn: 'Hospi-Cash Daily Benefit Plan', fullNameHi: 'हॉस्पि-कैश दैनिक लाभ योजना',
    category: 'Health', categoryHi: 'स्वास्थ्य',
    premiumEn: '₹100/month', premiumHi: '₹100 प्रति महीना',
    coverEn: '₹500/day cash while hospitalised', coverHi: 'अस्पताल में भर्ती रहने पर हर दिन ₹500 नकद',
    cover: '₹500/day', premium: '₹100/month',
    payEn: '₹100 is auto-debited every month from your linked bank account. You can pause anytime.',
    payHi: 'हर महीने आपके जुड़े बैंक खाते से ₹100 अपने आप कट जाते हैं। आप कभी भी रोक सकते हैं।',
    getEn: '₹500 cash for every day you are admitted in hospital, up to 15 days a year — on top of any other insurance you have.',
    getHi: 'अस्पताल में भर्ती हर दिन के ₹500 नकद, साल में 15 दिन तक — आपके किसी भी दूसरे बीमा के अलावा।',
    exitEn: 'Cancel anytime before the next monthly debit. No penalty, no minimum term.',
    exitHi: 'अगली मासिक कटौती से पहले कभी भी बंद कर सकते हैं। कोई जुर्माना नहीं, कोई न्यूनतम अवधि नहीं।',
    lockIn: 'None', lockInHi: 'कोई नहीं', time: '~6 min', timeHi: '~6 मिनट',
    officialUrl: 'https://www.irdai.gov.in',
  },
];

export interface Investment {
  id: string;
  name: string;
  nameHi: string;
  tierRank: number;
  category: string;
  returnPct: string;
  withdrawBadge: string;
  withdrawBadgeHi: string;
  min: number;
  reg: string;
  regHi: string;
}

export const INVESTMENTS: Investment[] = [
  { id: 'overnight', name: 'Overnight Fund', nameHi: 'ओवरनाइट फंड', tierRank: 0, category: 'liquid', returnPct: '6.4%', withdrawBadge: 'Withdraw within 1 day', withdrawBadgeHi: '1 दिन में निकाल सकते हैं', min: 500, reg: 'SEBI-regulated · AMFI', regHi: 'SEBI-नियंत्रित · AMFI' },
  { id: 'liquid', name: 'Liquid Fund', nameHi: 'लिक्विड फंड', tierRank: 0, category: 'liquid', returnPct: '6.8%', withdrawBadge: 'Withdraw within 1-2 days', withdrawBadgeHi: '1-2 दिन में निकाल सकते हैं', min: 500, reg: 'SEBI-regulated · AMFI', regHi: 'SEBI-नियंत्रित · AMFI' },
  { id: 'ultrashort', name: 'Ultra Short-Term Fund', nameHi: 'अल्ट्रा शॉर्ट-टर्म फंड', tierRank: 1, category: 'shortterm', returnPct: '7.2%', withdrawBadge: 'Withdraw within 2 days', withdrawBadgeHi: '2 दिन में निकाल सकते हैं', min: 1000, reg: 'SEBI-regulated · AMFI', regHi: 'SEBI-नियंत्रित · AMFI' },
  { id: 'shortdebt', name: 'Short-Term Debt Fund', nameHi: 'शॉर्ट-टर्म डेट फंड', tierRank: 2, category: 'shortterm', returnPct: '8.1%', withdrawBadge: '30-day lock-in', withdrawBadgeHi: '30 दिन का लॉक-इन', min: 1000, reg: 'SEBI-regulated · AMFI', regHi: 'SEBI-नियंत्रित · AMFI' },
];

export const INVEST_CATEGORIES = [
  { key: 'all', label: 'All', labelHi: 'सभी' },
  { key: 'liquid', label: 'Liquid Funds', labelHi: 'लिक्विड फंड' },
  { key: 'shortterm', label: 'Short-Term', labelHi: 'शॉर्ट-टर्म' },
];

export interface IncomeType { id: string; label: string; labelHi: string; sublabel: string; sublabelHi: string }

export const INCOME_TYPES: IncomeType[] = [
  { id: 'office', label: 'Salaried / Office employee', labelHi: 'वेतनभोगी / ऑफिस कर्मचारी', sublabel: 'Company job, fixed monthly salary', sublabelHi: 'कंपनी की नौकरी, तय मासिक वेतन' },
  { id: 'business', label: 'Micro-entrepreneur', labelHi: 'सूक्ष्म उद्यमी', sublabel: 'Shop, stall, or small business owner', sublabelHi: 'दुकान, स्टॉल, या छोटा व्यवसाय' },
  { id: 'delivery', label: 'Field & Delivery employee', labelHi: 'फील्ड और डिलीवरी कर्मचारी', sublabel: 'Auto, cab, or delivery partner', sublabelHi: 'ऑटो, कैब, या डिलीवरी पार्टनर' },
  { id: 'domestic', label: 'House and Care Work', labelHi: 'घर और देखभाल का काम', sublabel: 'Domestic help, caregiving, cooking', sublabelHi: 'घरेलू सहायता, देखभाल, खाना बनाना' },
  { id: 'freelance', label: 'Freelancing & Gigs', labelHi: 'फ्रीलांसिंग और गिग वर्क', sublabel: 'Project-based or contract work', sublabelHi: 'प्रोजेक्ट या कॉन्ट्रैक्ट आधारित काम' },
  { id: 'other', label: 'Others', labelHi: 'अन्य', sublabel: 'Something else not listed here', sublabelHi: 'यहां सूचीबद्ध कुछ और' },
];

export interface Provider { en: string; hi: string }

export const PROVIDERS: Provider[] = [
  { en: 'State Bank of India', hi: 'भारतीय स्टेट बैंक' },
  { en: 'HDFC Bank', hi: 'HDFC बैंक' },
  { en: 'ICICI Bank', hi: 'ICICI बैंक' },
  { en: 'Other Bank', hi: 'कोई और बैंक' },
];

export interface QuizOption { en: string; hi: string; score: number }
export interface QuizQuestion { textEn: string; textHi: string; options: QuizOption[] }

export const QUIZ: QuizQuestion[] = [
  { textEn: 'How steady is your monthly income?', textHi: 'आपकी मासिक आय कितनी स्थिर है?', options: [
    { en: 'Fixed every month', hi: 'हर महीने तय', score: 2 },
    { en: 'Varies a bit', hi: 'थोड़ा बदलता है', score: 1 },
    { en: 'Changes a lot', hi: 'बहुत बदलता है', score: 0 },
  ]},
  { textEn: 'If you suddenly needed ₹10,000, could you manage it?', textHi: 'अगर अचानक ₹10,000 की जरूरत पड़े, तो क्या आप संभाल सकते हैं?', options: [
    { en: 'Yes, easily', hi: 'हां, आसानी से', score: 2 },
    { en: 'With some difficulty', hi: 'थोड़ी मुश्किल से', score: 1 },
    { en: 'No, I would have to borrow', hi: 'नहीं, उधार लेना पड़ेगा', score: 0 },
  ]},
  { textEn: 'How many people depend on your income?', textHi: 'आपकी आय पर कितने लोग निर्भर हैं?', options: [
    { en: 'Just me', hi: 'सिर्फ मैं', score: 2 },
    { en: '1-2 people', hi: '1-2 लोग', score: 1 },
    { en: '3 or more', hi: '3 या ज्यादा', score: 0 },
  ]},
  { textEn: 'Do you already have any savings or investments?', textHi: 'क्या आपकी पहले से कोई बचत या निवेश है?', options: [
    { en: 'Yes, regularly', hi: 'हां, नियमित रूप से', score: 2 },
    { en: 'A little, sometimes', hi: 'थोड़ा, कभी-कभी', score: 1 },
    { en: 'No, none', hi: 'नहीं, बिलकुल नहीं', score: 0 },
  ]},
  { textEn: 'If you invest, how soon might you need that money back?', textHi: 'अगर आप निवेश करें, तो पैसा वापस कब चाहिए हो सकता है?', options: [
    { en: 'Fine locking it 30+ days for better returns', hi: 'बेहतर रिटर्न के लिए 30+ दिन लॉक कर सकता हूं', score: 2 },
    { en: 'Would prefer it back within a week', hi: 'एक हफ्ते में वापस चाहिए', score: 1 },
    { en: 'I need it available anytime, no exceptions', hi: 'मुझे कभी भी चाहिए, कोई अपवाद नहीं', score: 0 },
  ]},
];

export const EN = {
  continue: 'Continue', incomeTitle: 'What best describes your work?', incomeSubtitle: 'This helps us find schemes you qualify for.',
  antiscamTitle: 'Before we begin, a promise.', iUnderstand: 'I understand',
  aaTitle: 'Link your bank account', aaScopeLabel: 'WHAT WE ACCESS', linkBank: 'Link Bank Account', enterManually: 'Enter income manually instead',
  chooseBank: 'Choose your bank', linking: 'Linking your account securely…',
  manualIncomeTitle: 'What is your approximate monthly income?', manualIncomePlaceholder: 'e.g. 15000',
  yourRiskProfile: 'Your risk profile', goToDashboard: 'Go to Dashboard',
  searchPlaceholder: 'Search schemes, guides, or resources...', healthScoreTitle: 'Financial Health Score', goodStanding: 'Good Standing', healthScoreNote: 'Your savings habit is improving.',
  totalBalance: 'Total Available Balance', income: 'Income', expenses: 'Expenses', myInvestments: 'My Investments', view: 'View',
  recommendedForYou: 'Recommended for You', lastUpdated: 'Last updated', searchSchemes: 'Search schemes...', yourProtection: 'Your Protection', active: 'Active',
  recommendedSchemes: 'Recommended Schemes', enrollWithVaani: 'Enroll with Vaani',
  whatYouPay: 'What you pay', whatYouGet: 'What you get', exitConditions: 'Exit conditions', lockIn: 'Lock-in period', verifyOfficial: 'Verify on official government site',
  vaaniThinking: 'Vaani is thinking…', recommendation: 'Vaani’s recommendation', talkToHuman: 'Need to talk to a human? Tap here',
  typeOrSay: 'Type or say something...', name: 'Name', incomeType: 'Income type', monthlyIncomeLabel: 'Monthly income',
  enrolledSuccess: 'You’re enrolled!', certificate: 'CERTIFICATE', coverageAmount: 'Coverage', premium: 'Premium', refId: 'Reference ID',
  download: 'Download', share: 'Share', backToDashboard: 'Back to Dashboard',
  yourProfile: 'Your profile', liquidOptionsShown: 'liquid options shown', annualReturn: 'annual return', minInvestment: 'Min investment',
  searchInvestments: 'Search investment options...', noInvestmentsFound: 'No investment options match your search.',
  amountToInvest: 'Amount to invest', minimumIs: 'Minimum is', projected1Month: 'Projected value in 1 month', projected1Year: 'Projected value in 1 year',
  confirmInvest: 'Confirm Investment', investmentConfirmed: 'Investment confirmed!', investedIn: 'invested in',
  borrowingQuestion: 'How much do you need, and for how long?', amountPlaceholder: 'Amount needed (₹)', termPlaceholder: 'Repayment term (months)',
  seeMyOptions: 'See my options', skipShowOptions: 'Skip — show loan options',
  useSavingsTitle: 'You may not need to borrow', useSavingsBody: 'Your DhanSathi savings balance is', useSavingsCta: 'Use my savings instead',
  costComparison: 'Cost comparison for your loan', moneylender: 'Informal moneylender', totalInterestFor: 'Total interest for', months: 'months', monthShort: 'month', yearShort: 'year',
  govtScheme: 'Govt. scheme', youSave: 'You save', applyMudra: 'Apply for PM Mudra on Jan Samarth',
  riskProfileLabel: 'Risk profile', retake: 'Retake quiz', aaStatusLabel: 'Bank account link', revoke: 'Revoke', language: 'Language', reportScam: 'Report a scam call',
  apiKeyLabel: 'Claude API key', apiKeySaved: 'Saved', apiKeyPlaceholder: 'sk-ant-...', apiKeyHelp: 'Stored only in this browser. Needed for Vaani to respond.',

  splashTagline: 'Your money, made simple.',
  antiscamBody: 'DhanSathi will never call or message you asking for an OTP, password, or bank details. If anyone claims to be from DhanSathi and asks for these, it is a scam.',
  aaConsentBody: 'DhanSathi will read your last 6 months of bank transaction history, used only to understand your income and expenses. You can revoke this consent anytime from Settings — data deletes within 24 hours. This is via RBI-regulated Account Aggregator, not screen-sharing.',
  logIn: 'Log In', signUp: 'Sign Up', mobileNumber: 'Mobile Number', enterMobileNumber: 'Enter 10 digit number', getOtp: 'Get OTP',
  secureAndTrusted: '100% Secure & Trusted', agreeToTerms: "By continuing, you agree to DhanSathi's Terms.", help: 'Help',
  verifyPhone: 'Verify Phone', enterOtpSent: 'Enter the code sent to your phone.', didntReceiveCode: "Didn't receive code?", resendIn: 'Resend in', verifyAndProceed: 'Verify & Proceed',
  personalDetailsTitle: 'Personal Details', personalDetailsSubtitle: 'Tell us about yourself to tailor your DhanSathi experience.', step: 'Step', of: 'of', profileSetup: 'Profile Setup',
  fullName: 'Full Name', dateOfBirth: 'Date of Birth', gender: 'Gender', male: 'Male', female: 'Female', other: 'Other', residentialArea: 'Residential Area', selectYourArea: 'Select your area',
  needHelp: 'Need Help?', tapVaaniToSpeak: 'Tap the Vaani icon below to speak your details',
  occupationTitle: 'What best describes your work?', occupationSubtitle: 'This helps us find schemes you qualify for.',
  riskDoneHeadline: "You're all set!", riskDoneSubtext: "You're one step closer to a stronger financial future.",
  riskConservativeDesc: "You're conservative — we'll only show you liquid options you can withdraw anytime, with no lock-in.",
  riskModerateDesc: "You're moderate — we'll show liquid and short-term options, nothing locked beyond a few days.",
  riskGrowthDesc: "You're growth-oriented — you're comfortable with some lock-in for better returns, so we'll include short-term options too.",

  financialTracker: 'Financial Tracker', thisMonth: 'This Month', totalSpends: 'Total Spends', totalEarned: 'Total Earned',
  budgetLabel: 'Budget', budgetOver: 'Over budget', linkUpiBank: 'Link UPI / Bank', upiBankSublabel: 'RBI-regulated Account Aggregator',
  upiBankLinked: 'UPI / Bank linked', addIncomeCta: 'Add Income', addExpenseCta: 'Add Expense',
  recentEntries: 'Recent entries', noEntriesYet: 'No entries yet. Add your first income or expense above.',
  addIncomeTitle: 'Add Income', addExpenseTitle: 'Add Expense', amountLabel: 'Amount', categoryLabel: 'Category',
  otherCategoryLabel: 'Tell us what it was', otherCategoryPlaceholder: 'e.g. Phone recharge',
  incomeAdded: 'income added', expenseAdded: 'expense added', personalDetails: 'Personal Details', bankAccounts: 'Bank & UPI accounts',
  runBy: 'Run by', helpMeRegister: 'Help me register', notOurScheme: 'DhanSathi does not run this scheme. We research it, explain it, and help you apply.', researchedFrom: 'Researched from',

  // ---- shell / navigation ----
  navHome: 'Home', navBima: 'Bima', navBachat: 'Bachat', navUdhaar: 'Udhaar', navProfile: 'Profile',
  headerQuickProfile: 'Quick Profile', headerSchemeDetails: 'Scheme Details', headerInvest: 'Invest', headerProfile: 'Profile',
  quickInsurance: 'Insurance', quickInvest: 'Invest', quickBorrow: 'Borrow',
  askVaani: 'Ask Vaani', langTagline: 'Your financial companion, in your language.',
  // ---- Vaani ----
  vaaniName: 'Vaani', listening: 'Listening…', thinkingShort: 'Thinking…', tapMicOrType: 'Tap mic or type to talk',
  noApiKeyNotice: 'No Claude API key set — add one in Profile to let Vaani respond.',
  submitEnrollment: 'Submit Enrollment', linkedBankMasked: 'Linked Bank ••••1234',
  vaaniGenericError: 'Sorry, something went wrong. Please try again.',
  askForSchemeDetails: 'Tell me more about this scheme — who runs it, what it costs, and who can apply.',
  // ---- CTA labels for Vaani's recommendation ----
  ctaEnrollPmsby: 'Enroll in PMSBY', ctaEnrollPmjjby: 'Enroll in PMJJBY', ctaEnrollPmjay: 'View PM-JAY',
  ctaEnrollHospicash: 'Enroll in Hospi-Cash', ctaInvest: 'See investment options', ctaBorrowCompare: 'Compare borrowing options',
  ctaOpenOfficial: 'Open official page', ctaAskDetails: 'Ask Vaani for details',
  // ---- misc UI ----
  scrollTerms: 'Scroll to read all terms before enrolling', question: 'Question',
  linkedLabel: 'Linked', notLinkedLabel: 'Not linked', currentLabel: 'Current',
  apiKeyEnv: 'Configured via .env', apiKeyLocal: 'Configured (local override)', apiKeyNone: 'Not configured',
  apiKeyEnvHelp: 'Set VITE_CLAUDE_API_KEY in your .env file (see .env.example), then restart the dev server or redeploy.',
  certificateDownloaded: 'Certificate.pdf downloaded',
  useSavingsToast: 'Great — use your DhanSathi savings instead of borrowing.',
  reportScamMessage: 'I want to report a suspected scam call claiming to be from DhanSathi.',
  riskConservative: 'Conservative', riskModerate: 'Moderate', riskGrowth: 'Growth',
  shareEnrolledPrefix: 'I just enrolled in', shareEnrolledSuffix: 'via DhanSathi!', shareCoverFor: 'cover for',
  justNow: 'just now',
  availableBalance: 'Available Balance', addedThisMonth: 'Added', spentThisMonth: 'Spent',
  standingGood: 'Good Standing', standingFair: 'Watch your spending', standingLow: 'Spending over income',
  healthNoteGood: "You're keeping a healthy share of what you earn.",
  healthNoteFair: 'Most of your income is going out. Try to keep some aside.',
  healthNoteLow: 'You are spending more than you earn this month.',
  healthNoteEmpty: 'Add your income and expenses to see your score.',
  noIncomeYet: 'Add your income to get started',
  edit: 'Edit', editProfile: 'Edit profile', updateDetails: 'Update Details', detailsUpdated: 'Profile updated',
  editProfileSubtitle: 'Change any of the details you gave us when you signed up.',
  workType: 'Type of work', monthlyIncomeHelp: 'Changing this updates your balance and budget.',
};

export const HI: typeof EN = Object.assign({}, EN, {
  continue: 'आगे बढ़ें', incomeTitle: 'आपका काम किस तरह का है?', incomeSubtitle: 'इससे हमें आपके लिए सही योजनाएं ढूंढने में मदद मिलेगी।',
  antiscamTitle: 'शुरू करने से पहले, एक वादा।', iUnderstand: 'मैं समझ गया/गई',
  aaTitle: 'अपना बैंक खाता जोड़ें', aaScopeLabel: 'हम क्या एक्सेस करते हैं', linkBank: 'बैंक खाता जोड़ें', enterManually: 'इसके बजाय आय खुद बताएं',
  chooseBank: 'अपना बैंक चुनें', linking: 'आपका खाता सुरक्षित रूप से जोड़ा जा रहा है…',
  manualIncomeTitle: 'आपकी लगभग मासिक आय क्या है?', manualIncomePlaceholder: 'जैसे 15000',
  yourRiskProfile: 'आपकी जोखिम प्रोफ़ाइल', goToDashboard: 'डैशबोर्ड पर जाएं',
  searchPlaceholder: 'योजनाएं, गाइड खोजें...', healthScoreTitle: 'वित्तीय स्वास्थ्य स्कोर', goodStanding: 'अच्छी स्थिति',
  totalBalance: 'कुल उपलब्ध राशि', income: 'आय', expenses: 'खर्च', myInvestments: 'मेरे निवेश', view: 'देखें',
  recommendedForYou: 'आपके लिए सुझाव', searchSchemes: 'योजनाएं खोजें...', yourProtection: 'आपकी सुरक्षा', active: 'सक्रिय',
  recommendedSchemes: 'सुझाई गई योजनाएं', enrollWithVaani: 'वाणी के साथ Enroll करें',
  whatYouPay: 'आप क्या देंगे', whatYouGet: 'आपको क्या मिलेगा', exitConditions: 'बाहर निकलने की शर्तें', lockIn: 'लॉक-इन अवधि', verifyOfficial: 'सरकारी वेबसाइट पर जांचें',
  talkToHuman: 'किसी इंसान से बात करनी है? यहां टैप करें', typeOrSay: 'लिखें या बोलें...',
  enrolledSuccess: 'आप नामांकित हो गए हैं!', download: 'डाउनलोड करें', share: 'शेयर करें', backToDashboard: 'डैशबोर्ड पर वापस जाएं',
  confirmInvest: 'निवेश की पुष्टि करें', investmentConfirmed: 'निवेश की पुष्टि हो गई!',
  borrowingQuestion: 'आपको कितनी राशि चाहिए, और कितने समय के लिए?', seeMyOptions: 'मेरे विकल्प देखें', skipShowOptions: 'छोड़ें — लोन विकल्प दिखाएं',
  applyMudra: 'जन समर्थ पर PM Mudra के लिए आवेदन करें',

  antiscamBody: 'DhanSathi कभी OTP, पासवर्ड, या बैंक डिटेल्स फोन या मैसेज पर नहीं मांगेगा। अगर कोई DhanSathi के नाम से मांगे, वह फ्रॉड है।',
  aaConsentBody: 'DhanSathi आपके बैंक खाते के पिछले 6 महीने का लेन-देन इतिहास पढ़ेगा। इसका इस्तेमाल सिर्फ आपकी आय समझने के लिए होगा। आप कभी भी सहमति वापस ले सकते हैं। डेटा 24 घंटे में डिलीट हो जाता है। यह RBI-नियंत्रित अकाउंट एग्रीगेटर के माध्यम से है, स्क्रीन-शेयरिंग नहीं।',
  logIn: 'लॉग इन', signUp: 'साइन अप', mobileNumber: 'मोबाइल नंबर', enterMobileNumber: '10 अंकों का नंबर दर्ज करें', getOtp: 'ओटीपी प्राप्त करें',
  secureAndTrusted: '100% सुरक्षित और भरोसेमंद', agreeToTerms: 'जारी रखने पर, आप DhanSathi की शर्तों से सहमत होते हैं।', help: 'मदद',
  verifyPhone: 'फोन सत्यापित करें', enterOtpSent: 'अपने फोन पर भेजा गया कोड दर्ज करें।', didntReceiveCode: 'कोड नहीं मिला?', resendIn: 'में फिर से भेजें', verifyAndProceed: 'सत्यापित करें और आगे बढ़ें',
  personalDetailsTitle: 'व्यक्तिगत विवरण', personalDetailsSubtitle: 'आपके अनुभव को बेहतर बनाने के लिए अपने बारे में बताएं।', step: 'चरण', of: 'में से', profileSetup: 'प्रोफाइल सेटअप',
  fullName: 'पूरा नाम', dateOfBirth: 'जन्म तिथि', gender: 'लिंग', male: 'पुरुष', female: 'महिला', other: 'अन्य', residentialArea: 'रिहायशी इलाका', selectYourArea: 'अपना इलाका चुनें',
  needHelp: 'मदद चाहिए?', tapVaaniToSpeak: 'अपनी जानकारी बोलने के लिए वाणी आइकन पर टैप करें',
  occupationTitle: 'आपका काम किस तरह का है?', occupationSubtitle: 'इससे हमें आपके लिए सही योजनाएं ढूंढने में मदद मिलेगी।',
  riskDoneHeadline: 'आप तैयार हैं!', riskDoneSubtext: 'आप एक मजबूत वित्तीय भविष्य की ओर एक कदम और करीब हैं।',
  riskConservativeDesc: 'आप सतर्क निवेशक हैं — हम आपको सिर्फ ऐसे विकल्प दिखाएंगे जिन्हें आप कभी भी बिना लॉक-इन के निकाल सकते हैं।',
  riskModerateDesc: 'आप संतुलित निवेशक हैं — हम आपको लिक्विड और शॉर्ट-टर्म विकल्प दिखाएंगे, कुछ ही दिनों के लॉक-इन के साथ।',
  riskGrowthDesc: 'आप विकास-उन्मुख निवेशक हैं — आप बेहतर रिटर्न के लिए कुछ लॉक-इन सहज हैं, इसलिए हम शॉर्ट-टर्म विकल्प भी शामिल करेंगे।',

  financialTracker: 'वित्तीय ट्रैकर', thisMonth: 'इस महीने', totalSpends: 'कुल खर्च', totalEarned: 'कुल आय',
  budgetLabel: 'बजट', budgetOver: 'बजट से ज्यादा', linkUpiBank: 'UPI / बैंक लिंक करें', upiBankSublabel: 'RBI-नियंत्रित अकाउंट एग्रीगेटर',
  upiBankLinked: 'UPI / बैंक जुड़ा है', addIncomeCta: 'आय जोड़ें', addExpenseCta: 'खर्च जोड़ें',
  recentEntries: 'हाल की एंट्री', noEntriesYet: 'अभी कोई एंट्री नहीं। ऊपर से अपनी पहली आय या खर्च जोड़ें।',
  addIncomeTitle: 'आय जोड़ें', addExpenseTitle: 'खर्च जोड़ें', amountLabel: 'राशि', categoryLabel: 'श्रेणी',
  otherCategoryLabel: 'बताएं यह क्या था', otherCategoryPlaceholder: 'जैसे फोन रिचार्ज',
  incomeAdded: 'आय जोड़ी गई', expenseAdded: 'खर्च जोड़ा गया', personalDetails: 'व्यक्तिगत विवरण', bankAccounts: 'बैंक और UPI खाते',
  runBy: 'संचालक', helpMeRegister: 'रजिस्टर करने में मदद करें', notOurScheme: 'यह योजना DhanSathi की नहीं है। हम इसे खोजते हैं, समझाते हैं, और आवेदन में मदद करते हैं।', researchedFrom: 'स्रोत',

  navHome: 'होम', navBima: 'बीमा', navBachat: 'बचत', navUdhaar: 'उधार', navProfile: 'प्रोफ़ाइल',
  headerQuickProfile: 'त्वरित प्रोफ़ाइल', headerSchemeDetails: 'योजना का विवरण', headerInvest: 'निवेश', headerProfile: 'प्रोफ़ाइल',
  quickInsurance: 'बीमा', quickInvest: 'निवेश', quickBorrow: 'उधार',
  askVaani: 'वाणी से पूछें', langTagline: 'आपकी भाषा में, आपका वित्तीय साथी।',
  vaaniName: 'वाणी', listening: 'सुन रही हूं…', thinkingShort: 'सोच रही हूं…', tapMicOrType: 'बात करने के लिए माइक दबाएं या लिखें',
  noApiKeyNotice: 'Claude API की सेट नहीं है — वाणी के जवाब देने के लिए प्रोफ़ाइल में जोड़ें।',
  submitEnrollment: 'आवेदन जमा करें', linkedBankMasked: 'जुड़ा बैंक ••••1234',
  vaaniGenericError: 'माफ़ कीजिए, कुछ गड़बड़ हुई। कृपया दोबारा कोशिश करें।',
  askForSchemeDetails: 'इस योजना के बारे में और बताएं — इसे कौन चलाता है, खर्च कितना है, और कौन आवेदन कर सकता है।',
  ctaEnrollPmsby: 'PMSBY में Enroll करें', ctaEnrollPmjjby: 'PMJJBY में Enroll करें', ctaEnrollPmjay: 'PM-JAY देखें',
  ctaEnrollHospicash: 'हॉस्पि-कैश में Enroll करें', ctaInvest: 'निवेश के विकल्प देखें', ctaBorrowCompare: 'उधार के विकल्पों की तुलना करें',
  ctaOpenOfficial: 'आधिकारिक पेज खोलें', ctaAskDetails: 'वाणी से पूरी जानकारी लें',
  scrollTerms: 'Enroll करने से पहले सभी शर्तें पढ़ने के लिए नीचे स्क्रॉल करें', question: 'सवाल',
  linkedLabel: 'जुड़ा है', notLinkedLabel: 'नहीं जुड़ा', currentLabel: 'अभी',
  apiKeyEnv: '.env से सेट है', apiKeyLocal: 'सेट है (इसी ब्राउज़र में)', apiKeyNone: 'सेट नहीं है',
  apiKeyEnvHelp: 'अपनी .env फाइल में VITE_CLAUDE_API_KEY सेट करें (.env.example देखें), फिर dev सर्वर दोबारा चलाएं या रीडिप्लॉय करें।',
  certificateDownloaded: 'Certificate.pdf डाउनलोड हो गया',
  useSavingsToast: 'बढ़िया — उधार लेने के बजाय अपनी DhanSathi बचत इस्तेमाल करें।',
  reportScamMessage: 'मुझे DhanSathi के नाम पर आए एक संदिग्ध फ्रॉड कॉल की शिकायत करनी है।',
  riskConservative: 'सतर्क', riskModerate: 'संतुलित', riskGrowth: 'विकास-उन्मुख',
  shareEnrolledPrefix: 'मैंने अभी DhanSathi से', shareEnrolledSuffix: 'में नामांकन किया!', shareCoverFor: 'का कवर, प्रीमियम',
  justNow: 'अभी-अभी',
  availableBalance: 'उपलब्ध राशि', addedThisMonth: 'जोड़ा गया', spentThisMonth: 'खर्च हुआ',
  standingGood: 'अच्छी स्थिति', standingFair: 'खर्च पर ध्यान दें', standingLow: 'आय से ज्यादा खर्च',
  healthNoteGood: 'आप अपनी कमाई का अच्छा हिस्सा बचा रहे हैं।',
  healthNoteFair: 'आपकी ज्यादातर आय खर्च हो रही है। कुछ हिस्सा बचाने की कोशिश करें।',
  healthNoteLow: 'इस महीने आप कमाई से ज्यादा खर्च कर रहे हैं।',
  healthNoteEmpty: 'अपना स्कोर देखने के लिए आय और खर्च जोड़ें।',
  noIncomeYet: 'शुरू करने के लिए अपनी आय जोड़ें',
  edit: 'बदलें', editProfile: 'प्रोफ़ाइल संपादित करें', updateDetails: 'विवरण अपडेट करें', detailsUpdated: 'प्रोफ़ाइल अपडेट हो गई',
  editProfileSubtitle: 'साइन अप के समय दी गई कोई भी जानकारी यहां बदल सकते हैं।',
  workType: 'काम का प्रकार', monthlyIncomeHelp: 'इसे बदलने पर आपकी उपलब्ध राशि और बजट भी बदल जाएगा।',

  // ---- Hindi for keys that previously fell back to English ----
  healthScoreNote: 'आपकी बचत की आदत बेहतर हो रही है।', lastUpdated: 'आखिरी अपडेट',
  vaaniThinking: 'वाणी सोच रही है…', recommendation: 'वाणी का सुझाव',
  name: 'नाम', incomeType: 'आय का प्रकार', monthlyIncomeLabel: 'मासिक आय',
  certificate: 'प्रमाणपत्र', coverageAmount: 'कवर राशि', premium: 'प्रीमियम', refId: 'संदर्भ आईडी',
  yourProfile: 'आपकी प्रोफ़ाइल', liquidOptionsShown: 'लिक्विड विकल्प दिखाए गए', annualReturn: 'सालाना रिटर्न',
  minInvestment: 'न्यूनतम निवेश', searchInvestments: 'निवेश विकल्प खोजें...',
  noInvestmentsFound: 'आपकी खोज से कोई निवेश विकल्प नहीं मिला।',
  amountToInvest: 'निवेश की राशि', minimumIs: 'न्यूनतम है',
  projected1Month: '1 महीने में अनुमानित राशि', projected1Year: '1 साल में अनुमानित राशि',
  investedIn: 'में निवेश किया गया', amountPlaceholder: 'जरूरी राशि (₹)', termPlaceholder: 'चुकाने की अवधि (महीने)',
  useSavingsTitle: 'शायद आपको उधार लेने की जरूरत ही नहीं', useSavingsBody: 'आपकी DhanSathi बचत है',
  useSavingsCta: 'इसके बजाय अपनी बचत इस्तेमाल करें', costComparison: 'आपके लोन की लागत की तुलना',
  moneylender: 'साहूकार से उधार', totalInterestFor: 'कुल ब्याज', months: 'महीने', monthShort: 'महीना', yearShort: 'साल',
  govtScheme: 'सरकारी योजना', youSave: 'आपकी बचत', riskProfileLabel: 'जोखिम प्रोफ़ाइल', retake: 'क्विज़ दोबारा दें',
  aaStatusLabel: 'बैंक खाता लिंक', revoke: 'हटाएं', language: 'भाषा', reportScam: 'फ्रॉड कॉल की शिकायत करें',
  apiKeyLabel: 'Claude API की', apiKeySaved: 'सेव हो गया', apiKeyPlaceholder: 'sk-ant-...',
  apiKeyHelp: 'सिर्फ इसी ब्राउज़र में सेव होती है। वाणी के जवाब देने के लिए जरूरी है।',
  splashTagline: 'आपका पैसा, आसान भाषा में।',
});

export function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-IN');
}

// ---- Financial tracker (manual income / expense entry) -------------------
// Categories are deliberately short and concrete: the target user taps one,
// they do not read a dropdown. "other" always renders a free-text box so we
// never force a wrong bucket (PRD §882 — auto-categorisation is post-MVP).

export interface TrackerCategory { id: string; label: string; labelHi: string }

export const EXPENSE_CATEGORIES: TrackerCategory[] = [
  { id: 'food', label: 'Food', labelHi: 'भोजन' },
  { id: 'rent', label: 'Rent', labelHi: 'किराया' },
  { id: 'fuel', label: 'Fuel', labelHi: 'ईंधन' },
  { id: 'medical', label: 'Medical', labelHi: 'दवा-इलाज' },
  { id: 'education', label: 'Education', labelHi: 'पढ़ाई' },
  { id: 'other', label: 'Others', labelHi: 'अन्य' },
];

export const INCOME_CATEGORIES: TrackerCategory[] = [
  { id: 'salary', label: 'Salary', labelHi: 'वेतन' },
  { id: 'business', label: 'Business', labelHi: 'व्यापार' },
  { id: 'gig', label: 'Gig / Trip', labelHi: 'गिग / ट्रिप' },
  { id: 'gift', label: 'Gift', labelHi: 'उपहार' },
  { id: 'refund', label: 'Refund', labelHi: 'वापसी' },
  { id: 'other', label: 'Others', labelHi: 'अन्य' },
];

export interface TrackerEntry {
  id: string;
  kind: 'income' | 'expense';
  amount: number;
  categoryId: string;
  customLabel: string;
  at: number;
  source: 'manual' | 'imported';
}

/**
 * The transactions a bank link "reads" for the current month. The AA flow is
 * simulated, but the totals it produces must still be traceable: rather than
 * dropping an unexplained income figure into state, it creates these entries
 * so every rupee on the dashboard maps to a row the user can see in the
 * tracker. Revoking the consent deletes them again.
 */
export function importedEntries(now: number): TrackerEntry[] {
  const day = 24 * 60 * 60 * 1000;
  const rows: Array<[TrackerEntry['kind'], number, string, number]> = [
    ['income', 9400, 'gig', 3],
    ['income', 8800, 'gig', 17],
    ['expense', 3200, 'rent', 20],
    ['expense', 1750, 'food', 9],
    ['expense', 950, 'fuel', 5],
    ['expense', 500, 'medical', 2],
  ];
  return rows.map(([kind, amount, categoryId, daysAgo], i) => ({
    id: `aa-${i}`, kind, amount, categoryId, customLabel: '',
    at: now - daysAgo * day, source: 'imported' as const,
  }));
}

export function trackerCategories(kind: 'income' | 'expense'): TrackerCategory[] {
  return kind === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function trackerEntryLabel(e: TrackerEntry, lang: 'en' | 'hi'): string {
  if (e.customLabel) return e.customLabel;
  const cat = trackerCategories(e.kind).find(c => c.id === e.categoryId);
  if (!cat) return '—';
  return lang === 'hi' ? cat.labelHi : cat.label;
}

export function entryTimeLabel(at: number, lang: 'en' | 'hi'): string {
  return new Date(at).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' });
}
