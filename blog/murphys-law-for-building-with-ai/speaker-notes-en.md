catatan pembicara / speaker notes · english
the running order follows the current blog deck. plan for about 12 to 15 minutes including the demo and discussion; adjust to your own speaking pace. the cues are guidance, not lines to be read aloud.

## 1. anything that can go wrong will go wrong

hai everyone. today i want to share something i am still learning to do more consistently myself. so i am not here as an expert, but as someone who sometimes gets a little too pleased when ai makes the work feel fast.

the title does sound pessimistic: anything that can go wrong can still go wrong in the end. but i stay optimistic about what ai offers. the pessimism i want to invite is about how we plan to use it.

in about fifteen minutes we will look at why fast and convincing output still needs checking, then at four simple habits that help. the hope is that we go home with one habit to try on the next piece of work.

cue: pause after "too pleased". open calmly, like starting a chat with a colleague.

## 2. from a song to a way of working

before the idea, a short story about why i picked this topic. i am krishna. i like products, systems, and music, and this time all three met.

last june, after an eight year relationship ended, music helped settle my mind. later i found "hukum murphy" by kafin sulthan.

to my ear the sound recalls french pop of the seventies and eighties, then shibuya-kei of the nineties. that is my impression as a listener. when i found out this was the work of an indonesian musician, the reaction was immediate: "c'mon, anak negeri!" there is a happiness in finding music that feels close to your own taste.

kafin's talent is remarkable to me. he is also an interior architecture graduate of ui and has worked with candra darusman through chaseiro. it is interesting to see how music and design meet in one person.

then i started paying attention to the lyrics and the ideas. murphy, which i had only known from engineering, connects to how we work in product: thinking about what can go wrong so we are readier for uncertainty.

yesterday at ipc, designer, pm, data, and writer friends had different views on discovery and ai. time ran out while the basic question stayed open. so today i want to share how i see it. this is a view i am still testing too.

from that song i carried one question into work: when ai makes many things easier, which part still needs our checking? we start from the most obvious change: making something is now much cheaper.

references (not read aloud): https://p-vine.jp/news/20260713-120035 ; https://www.medcom.id/hiburan/musik/JKRAvZQk-kafin-sulthan-ingin-berkolaborasi-dengan-candra-darusman

cue: after the june story, a short pause. follow the record motion and the red path into the work question. the three parts of the story take turns for emphasis. say "c'mon, anak negeri!" with a light smile, then connect it to the ipc discussion.

## 3. making got cheap. being right did not.

making something now feels much cheaper. a prd draft, a mockup, or a prototype that used to take several stages can now start from one prompt. that helps a lot.

in this chart the dark line shows the effort to make something coming down. but the red line reminds us that the consequences of making the wrong thing stay. if the wrong price shows or a voucher fails at checkout for a customer, we still have to handle the fallout.

this chart is an illustration, not a measurement. what it wants to show is the gap: we feel faster, then without noticing we also feel righter. speed of making and correctness of the result need to be checked separately.

cue: point at both lines, then pause briefly on the gap between them.

## 4. ai sounds just as sure when it is wrong

take this draft for a reorder feature. at a glance the writing is tidy and sounds ready for development. but read it slowly and a few questions appear.

where does this twenty three percent figure come from? when a user taps reorder, is the order created straight away? what if stock runs out, the price changes, or the address was already deleted? and "real-time loyalty engine", which system is that?

there is also a line saying all edge cases are handled, without naming the cases. the status says "ready", while the scope boundary and the decision owner are not clear.

this is a made up example for discussion. the point is that a confident tone does not answer those questions. we still need to look for the evidence, the assumptions, and the decisions that are actually still open.

cue: pick two or three highlights on screen. do not read the whole draft out.

## 5. four habits, borrowed from things that break

from there i tried to summarise it into four habits. we borrow them from how people deal with things that can break or fail.

first, murphy: assume the wrong way will be tried, then make the wrong way harder to do. second, reka peluang: imagine the failure cases first, including the paths that are less comfortable to talk about. third, keep a buffer: time or room to check when reality does not match the plan. fourth, prepare recovery so a failure can still be handled.

in the next few slides we start with murphy and its design examples, then move through the other three habits. you do not need to remember every term. just notice which one is most often skipped in the way we work.

cue: use this slide as a map. do not start explaining every example in detail.

## 6. ai adds steps for free. murphy charges for every one.

this part is a little numerical, but the idea is simple. imagine each step has a ninety five percent chance of being right. with ten steps, the chance that at least one step is wrong comes to about forty percent. with twenty steps, about sixty four percent.

these numbers are a mathematical illustration, not a measure of ai accuracy. the formula also assumes every step is independent, while in real work errors can be linked to each other.

the takeaway: the more claims, screens, or agents you add, the more parts need checking. ai makes it easy to add them all. so before adding another step, maybe we should ask: does this really help, or does it only add checking work?

cue: move the slider once. briefly repeat that this is an illustration with an independent assumption.

## 7. murphy's law was a design brief, not a mood

the murphy story that gets told most is about rocket sled testing in 1949, when a sensor was installed the wrong way. i take the design lesson from it: if there is a wrong way to install something, do not just hope everyone always remembers.

we already know this approach. the cut corner on a sim card shows you the orientation. usb-c fits either way round. the shape of a thing helps you do the right thing.

when working with ai the approach can be a template, a schema, clear system names, and non-goals written from the start. so before asking for output, we set a boundary that can be checked. an empty page feels free, but it also leaves a lot of room for assumptions we did not intend.

cue: point at the physical example first, then connect it to templates and prompt boundaries.

## 8. imagine it already failed. then list why.

the next example uses the 1935 bomber crash story that often comes up in discussions of checklists: a control lock was left in place, and it became a significant part of the failure. the lesson sits close to our work. capable people can still skip one step.

before asking ai for a solution we can run a simple premortem. imagine the feature has already shipped and it failed. why, roughly?

for reorder: stock gone, price changed, address deleted, voucher already used, user double taps, or the payment expires.

this list can become test cases, product decisions, or clearly stated non-goals. so once in a while, start from the failure list before the feature list. it gives us a chance to see the problem while the cost of fixing it is still smaller.

cue: pause after "why, roughly", so the audience has time to imagine it too.

## 9. slack looks like waste until the bad week

buffer often looks like something that can be trimmed. in the retail example, safety stock feels excessive until demand rises and deliveries are late at the same time. that is when the spare room helps.

in work with ai the buffer can be dedicated time to reread, or a second reader asked to challenge the draft. if you use another model, give it a specific job: find the assumptions, the unsupported claims, and the parts that cannot be tested yet.

of course a second reader or model can be wrong too. so review still needs a human decision. we can cap it at two rounds, then decide what gets fixed and what stays open. part of the time ai saves can go into this checking.

cue: stress "part of the time". avoid the impression that all work needs a long review process.

## 10. design the fall, not just the climb

the otis demonstration story of 1854 is often used to explain this approach. in that demonstration the rope was cut and the safety mechanism held the platform. attention also went to what happens when the support fails.

in my workflow i separate the model that builds from the model that reviews. the builder makes the draft. the skeptic looks for weak assumptions, unsupported claims, and failure cases not yet discussed. the verifier runs checks that can be repeated, such as lint, tests, and render output. so one checks the thinking, one checks the testable things.

models also have different abilities and limits. gemini, for example, can help with understanding images, audio, or video; for implementation we can pick a model that suits the coding task. choose by the task and by our own check results, not by the model name. a different reviewer gives another point of view, but can still be wrong or share the same blind spot.

if review finds a problem, the output goes back to the builder. if it shipped and broke, we need a clear checkpoint or rollback. passing ai review is not the release decision: the final gate is still human.

when building with ai we need to ask the same thing: if the output misbehaves, how do we stop it or recover?

version control helps return code changes. a prototype can be held until review finishes. when a process fails, the user needs to know its status and the next step.

review helps find mistakes, but it does not guarantee everything is caught. the otis mechanism gives a picture of failures that can still be held; the analogy is limited, because a software change has different causes and effects. rollback also needs checkpoints that actually exist. changes in an outside system may need different handling. check the recovery path and its limits from the start, instead of waiting for the problem to happen.

references (not read aloud): https://ai.google.dev/gemini-api/docs/video-understanding

cue: follow the builder flow, the two kinds of review, then the human gate. point at the return path for revisions and rollback.

## 11. optimistic about the goal. pessimistic about every step.

if you take those four habits into tomorrow's work, the shape is simple. before starting, look at how many steps or claims you are asking for. write the non-goals and a few failure cases. leave time for review. then work out how to fix or revert the change if needed.

i still skip this myself sometimes, especially when the first output already looks good and the deadline feels close. so this is a reminder for me too.

we can be optimistic about the goal and about what ai offers. with the steps themselves we can be more careful. making something is easier now; making sure the result is fit to use is still our work. it does not have to be perfect, but it should be clear what has been checked and what has not.

cue: slow down at the end. this is where you summarise before opening the deck making process.

## 12. this deck was made 100% by ai

and a small confession: the deck you are looking at was made with ai too. the phrase "one hundred percent" here means ai did the research, the writing, the visuals, and the deck build, with human input and review.

i set the direction: the angle, the four habits, the style, and the feedback. the first draft had too many work examples. the next one tried too hard to show what it could do. that direction was corrected, and the result still needed a human check.

this diagram shows the role workflow in my workspace, not a claim that every role is always called for every deck. naquuuubot coordinates the flow. the curator helps with taste, the librarian with research, the scribe shapes the story, and the builder does the work. the skeptic challenges assumptions; the verifier checks the testable parts. the packet moves through each handoff. the final decision stays with the human.

using the maths slide logic, there are certainly many parts that could be wrong. but we have no failure probability figure for this deck. take it as a small reminder: ai can build the presentation material, while we stay responsible for what we say.

cue: follow the packet from human input to naquuuubot, then to the authoring and review roles. point at the return path from the skeptic before closing on the human decision.

## 13. now the human loop. your turn.

now i want to borrow your eyes as the next readers. if any part of this deck feels off, too simplified, or does not answer an important question, let us talk about it.

maybe start from one example: has a failure case ever only become visible after the work was done? or is there a part of the process that would be safer with a little buffer?

i want to hear how those four habits feel in the way you work, including the parts that do not fit.

feedback from this conversation can become material for the next revision. we have seen what ai helped make; now we check together the parts that can still be improved.

cue: leave 2 to 3 minutes. pick one opening question, then give the audience room to answer.
