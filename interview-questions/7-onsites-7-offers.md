Original Post: https://www.teamblind.com/post/7-onsites-7-offers-aAFTykAD

---

Have always used Blind to get great insights into my industry, wanted to share my recent job search results and materials I used for studying.

I have 6 yoe with TC 530k and tried to break into staff level this time around. Prepared 1 month with a mix of LC, system design, and behavioral preparation. I knew that my yoe is low, so will be a uphill battle. I ended up doing 7 onsites and got 7 offers (some senior, some staff). Sharing the resources that helped me be successful.

— LEETCODE —

Always ask clarifying questions, they are meant to be vague.

Tech Interview Handbook (solve 50 suggested LCs multiple times)
https://www.techinterviewhandbook.org/software-engineering-interview-guide/
Grokking Coding Interview:
https://www.educative.io/courses/grokking-the-coding-interview

I always try to solve each question myself before looking at answers. After struggling with certain topics, I found some youtube resources that were really helpful.

Graph problems: https://youtu.be/tWVWeAqZ0WU
Kahn’s topsort: https://youtu.be/cIBFEhD77b4
Dijkstra’s shortest path: https://youtu.be/pSqmAO-m7Lk
Kruskal’s MST: https://youtu.be/JZBQLXgSGfs
Union find: https://youtu.be/ibjEGG7ylHk
Dynamic programming: https://youtu.be/oBt53YbR9Kk

I would say 1/2 of my coding questions was graph related, and I used topsort, MST, union find during my interviews so its worth knowing them well.

Really great resource on Binary Search (especially for harder variants): https://leetcode.com/discuss/general-discussion/786126/Python-Powerful-Ultimate-Binary-Search-Template.-Solved-many-problems

Quite a few LC hards involve binary search as part of its solution, but its non-obvious.

At staff level, you are expected to have great communication, come up with one or more high level solutions in reasonable time with space and time complexity, implement mostly correct, and check for errors independently.

— SYSTEM DESIGN —

Always ask clarifying questions, they are meant to be vague.

Number 1 tip: Pay for mock interviews, take extensive notes, study, pay for more interviews. I used igotanoffer.com. Try booking different interviewers, they have different expectations, communication, friendliness.

Grokking system design: https://www.educative.io/courses/grokking-the-system-design-interview

It’s good to complete grokking, but in practice its a little too shallow for staff level.

Watch all videos and take notes from this channel: https://youtube.com/c/SystemDesignInterview

Most other channels like Exponent are actually not great examples of a good interviewee for staff level.

Read papers on Dynamo, BigTable, MapReduce, Cassandra, Raft, Lamport Clocks, etc.

A lot of material written by this Medium writer is great: https://medium.com/@kousiknath

Memorize Jeff Dean’s latency numbers: https://gist.github.com/jboner/2841832

If you have time, read DDIA: https://dataintensive.net

I memorized mnemonics for structure of how I execute my interview, as well as for each topic. Like OSI model, caching strategies, load balancing strategies, database types, etc. You need to make up your own in order to ingrain them.

Number 2 tip: Every system design question has a point of contention. Is it storage? Latency? Where will the system start to break? This is pivotal to figure out asap.

Basic structure:
Requirements (functional / non-functional)
Estimations (focus on contention point)
System API
Data model
High level design (core components)
Detailed design (ask where to dive in)
Bottlenecks (scale, redundancy, SPOFs, metrics, logs, alerts, dashboards, pagerduty, deployment, failure scenarios)

As staff level interviewee, you are expected to lead the interview and provide alternatives, weigh pros & cons of each approach and commit to one with justification. Outside of typical system design topics, staff level also needs to consider costs, system complexity, and business aspects (e.g. CDN too expensive for free tier).

For most interviewers, you should be familiar with at least one database technology for each category (key value, document, columnar, relational, etc). For Google, they typically want you to design from fundamentals instead of using off the shelf technologies.

I mastered using excalidraw for my system design interviews and always ask if I can use it instead: https://excalidraw.com

Number 3 tip: Listen intently to interviewer when they speak and take their hints.

— BEHAVIORAL —

Prepare an introduction about yourself. Keep it short and sweet, highlighting background and - a major accomplishment. (Don’t be afraid to sell yourself)

Grokking the behavioral: https://www.educative.io/courses/grokking-the-behavioral-interview

The resource itself isn’t that useful but should prepare answers from your own experience and recording yourself. Take time to reflect on your past few years and make sure you have answers about conflict, projects you led, giving/receiving feedback, and challenges you solved. Don’t lie.

STAR is a good structure for your stories but I learned a better story shape from this YouTuber.

U shape story: https://youtu.be/hU6BVxtGd5g

Read “Staff Engineer”: https://staffeng.com/book

For each company, make sure you know their products, their company motto and values. I kept notes which I read a few mins before my onsite starts. Prepare plenty of questions to ask.

— OFFERS —

Current TC 530k (Senior)

AtoB (Senior/Staff)
TC 325k
Base 200k, Options 500k over 4 years
Notes: Hard to evaluate startup offer, it felt too low and risky for me.

Airbnb G9 (Senior)
TC 450k
Base 225k, RSU 825k over 4 years, Sign on 80k
Notes: I did an uplevel round for staff after onsite. Recruiter said based on interviewing perf, the team will vouch for me for staff. After uplevel round, they said I did well but team wants to be conservative so no staff offer. I passed on the senior offer.

Google L5 (Senior)
TC ~480k
Notes: No actual numbers. I did a L6 onsite, went on and matched a team for TLM role. HC came back down leveling citing YOE but with highest verbal offer. I passed on the senior offer.

Roblox IC4 (Senior/Staff)
TC ~560k
Notes: No actual numbers. Roblox had the most rounds out of everybody. Kept pushing me to share numbers saying they want to beat them all and put together an offer only once. I shared staff level expectations (IC5) and eventually shared my highest numbers because they wouldn’t proceed. They came back saying IC5 needs 10 yoe and that I should take the other offers.

Snap L5 (Staff?)
TC 576k
Base 225k, Bonus 34k/year, RSU 940k over 3 years, Sign on 15k
Notes: Not sure if Snap L5 is staff but that is what they said it maps to. Negotiated from 550k and apparently this is the max.

Stripe L4 (Staff)
TC 690k
Base 250k, Bonus 40k/year, RSU 380k/year, Sign on 80k
Notes: Originally got L3 (Senior) offer but persuaded recruiter to try staff loop. Passed staff loop and then negotiated from 650k.

Quant firm
TC 800k
Base 210k, Bonus 590k/year
Notes: Didn’t think I’d get it but I somehow I did it. Questions similar to regular FANG. Negotiated from 750k. I ended up taking this offer because it’s cash and I’m concerned about recession.

Always negotiate! And try to get multiple offers as that is the best form of leverage. Read this:
https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/
