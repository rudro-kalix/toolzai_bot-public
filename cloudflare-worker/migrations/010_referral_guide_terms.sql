INSERT INTO bot_settings (key, value, updated_at) VALUES
  ('referral_terms_en', '📘 REFERRAL GUIDE AND TERMS

HOW TO EARN
1. Open 🎁 Refer and Earn and copy your personal link.
2. Your friend must open the bot for the first time through that exact link.
3. When that referred user completes a paid purchase, Tk 100 is added to your referral wallet.
4. Every separate completed order earns Tk 100. Registration, verification, adding balance, cancelled or failed orders do not earn a reward.

TRACKING
• The first valid referral link used for an account determines its referrer.
• The dashboard shows referred users, their completed-order count, your reward and withdrawal history.
• A bulk order recorded as one completed order earns one Tk 100 reward.

WITHDRAWAL
• You may request any whole-Taka amount from your available referral balance.
• Enter a valid 11-digit bKash number and check it carefully.
• A requested amount is reserved while pending. Admin reviews the bot records before marking it paid or rejected.
• If rejected, the reserved amount becomes available again. Processing time can vary because each request is reviewed.

FAIR USE AND PRIVACY
• Self-referral, fake or duplicate accounts, purchase manipulation, spam and other abuse are prohibited. A suspicious request may be investigated, rejected or the account may be restricted.
• Bot order, referral and withdrawal records are used to settle reward calculations.
• Referrers can see the referred user name or username, completed-purchase count and earned reward. Payment transaction IDs and bKash details are not shown to referrers. Admin receives the information needed to review a withdrawal.

HELP AND ACCEPTANCE
• For a missing reward or withdrawal issue, contact support with your Telegram ID and withdrawal ID.
• By using Refer and Earn, you accept these rules. The program or reward rate may change for future activity; important changes will be announced.', CURRENT_TIMESTAMP),
  ('referral_terms_bn', '📘 রেফারেল নির্দেশিকা ও শর্তাবলি

কীভাবে আয় করবেন
১. 🎁 Refer & Earn খুলে আপনার ব্যক্তিগত রেফারেল লিংক কপি করুন।
২. নতুন ব্যবহারকারীকে প্রথমবার ওই লিংক দিয়েই বট চালু করতে হবে।
৩. রেফার করা ব্যবহারকারী একটি পেইড অর্ডার সফলভাবে সম্পন্ন করলে আপনার রেফারেল ওয়ালেটে ১০০ টাকা যোগ হবে।
৪. প্রতিটি আলাদা completed order-এর জন্য ১০০ টাকা পাবেন। শুধু রেজিস্ট্রেশন, ভেরিফিকেশন, ব্যালেন্স যোগ করা, বাতিল বা ব্যর্থ অর্ডারে কোনো আয় হবে না।

হিসাব ও ড্যাশবোর্ড
• একটি অ্যাকাউন্ট প্রথম যে বৈধ রেফারেল লিংকে যুক্ত হবে, সেটিই তার রেফারার হিসেবে থাকবে।
• ড্যাশবোর্ডে রেফার করা ব্যবহারকারী, তাদের completed order-এর সংখ্যা, আপনার আয় ও withdrawal history দেখা যাবে।
• একটি bulk order সিস্টেমে একটি completed order হিসেবে রেকর্ড হলে তার reward একবারই ১০০ টাকা হবে।

উইথড্র নিয়ম
• Available referral balance থেকে যেকোনো পূর্ণ টাকার amount withdraw request করতে পারবেন।
• সঠিক ১১ সংখ্যার bKash নম্বর দিন এবং সাবমিটের আগে ভালোভাবে মিলিয়ে নিন।
• Request pending থাকলে ওই টাকা সাময়িকভাবে reserve থাকবে। Admin বটের রেকর্ড যাচাই করে Paid অথবা Rejected করবেন।
• Rejected হলে reserve করা টাকা আবার available balance-এ ফিরবে। প্রতিটি request যাচাই হয়, তাই processing time ভিন্ন হতে পারে।

সঠিক ব্যবহার ও গোপনীয়তা
• Self-referral, ভুয়া বা duplicate account, purchase manipulation, spam বা অন্য কোনো অপব্যবহার নিষিদ্ধ। সন্দেহজনক request তদন্ত, reject বা account restriction-এর আওতায় আসতে পারে।
• Reward হিসাবের ক্ষেত্রে বটের order, referral ও withdrawal record চূড়ান্ত রেকর্ড হিসেবে ধরা হবে।
• Referrer শুধু referred user-এর নাম/username, completed purchase count ও earned reward দেখবেন। Payment transaction ID বা bKash তথ্য referrer-কে দেখানো হবে না। Withdrawal যাচাইয়ের প্রয়োজনীয় তথ্য শুধু admin পাবেন।

সহায়তা ও সম্মতি
• Reward না এলে বা withdrawal সমস্যা হলে Telegram ID এবং withdrawal ID দিয়ে Support-এ যোগাযোগ করুন।
• Refer & Earn ব্যবহার করলে আপনি এই নিয়মগুলো মেনে নিচ্ছেন। ভবিষ্যৎ activity-এর জন্য program বা reward rate পরিবর্তন হতে পারে; গুরুত্বপূর্ণ পরিবর্তন announcement-এ জানানো হবে।', CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;

UPDATE bot_menu_drafts
SET menu_json = json_set(
  menu_json,
  '$.responses.referral_terms.text_en', (SELECT value FROM bot_settings WHERE key = 'referral_terms_en'),
  '$.responses.referral_terms.text_bn', (SELECT value FROM bot_settings WHERE key = 'referral_terms_bn')
)
WHERE json_valid(menu_json);
