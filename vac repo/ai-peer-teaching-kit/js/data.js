/**
 * AI Peer Teaching Kit for Weak Topics - Core Educational Data
 * Built-in rich offline content across multiple disciplines
 */

const DEFAULT_TOPICS = [
  {
    id: "recursion",
    title: "Recursion & Call Stack",
    subject: "Programming & Data Structures",
    badge: "💻 CS & Coding",
    confidenceDefault: 2,
    difficulty: "Intermediate",
    summary: "Solving complex problems by breaking them into self-similar sub-problems with a well-defined base condition.",
    robotExplanation: {
      intro: "Greetings, fellow scholar! Let us unravel Recursion—the ancient art where a function summons itself to conquer smaller pieces of the same puzzle.",
      analogy: "Imagine an ornate set of Russian Matryoshka nesting dolls. To find the golden coin hidden in the smallest doll, you open one doll, which reveals another doll, which reveals another... until you hit the solid baby doll (the Base Case) that cannot be opened! Once you reach it, you begin closing the dolls back up one by one, returning your answer back up the chain.",
      keyPoints: [
        "Base Case: The vital stopping condition that halts recursive calls and prevents the dreaded Stack Overflow.",
        "Recursive Step: The function calling itself with modified, smaller input that steadily approaches the base case.",
        "Call Stack Frame: Every call is stacked on top of memory like a pile of heavy library books; when a call finishes, it is popped off.",
        "Space Complexity: Even if you don't declare arrays, recursive calls occupy O(depth) memory on the runtime call stack."
      ],
      mnemonic: "Remember 'B.R.S.' ➜ Base Case first, Reduce the problem, Stack unwinds safely!",
      interactivePrompt: "Trace: factorial(3) = 3 * factorial(2) = 3 * (2 * factorial(1)) = 3 * (2 * 1) = 6."
    },
    teachBackRubric: {
      targetAudience: "A 10-year-old apprentice who understands Russian nesting dolls and stacks of plates.",
      requiredKeywords: ["base case", "call", "smaller", "stop", "stack", "return"],
      idealAnswerSummary: "A function that solves a problem by calling itself on smaller inputs until it hits a base case (stopping condition), then unwinds and passes results back up.",
      conceptChecklist: [
        { name: "Mentioned stopping condition / base case", weight: 30, regex: /base\s*case|stopping\s*condition|exit\s*condition|stop/i },
        { name: "Explained self-calling on smaller input", weight: 25, regex: /calls?\s*(itself|themselves)|smaller|reduce|sub-?problem/i },
        { name: "Referenced stack or memory unwinding", weight: 25, regex: /stack|unwind|return|memory|pop|push/i },
        { name: "Provided clear intuitive example or analogy", weight: 20, regex: /doll|stair|plate|book|tree|mirror|example|like/i }
      ]
    },
    quizQuestions: [
      {
        question: "What catastrophic error occurs if a recursive function fails to reach its base case?",
        options: [
          "Null Pointer Exception",
          "Stack Overflow Error",
          "Memory Fragmentation Fault",
          "Type Mismatch Compilation Error"
        ],
        correct: 1,
        explanation: "Without a base case, recursive calls consume stack frames infinitely until the assigned call stack memory is exhausted, throwing a Stack Overflow."
      },
      {
        question: "Which of the following is the most critical element inside any recursive algorithm?",
        options: [
          "A while loop counter",
          "A base case that terminates recursion",
          "A global database connection",
          "A heap allocation pointer"
        ],
        correct: 1,
        explanation: "The base case acts as the guardian anchor that stops infinite self-invocation and allows the call stack to safely unwind."
      },
      {
        question: "When calculating Fibonacci numbers naively using `fib(n) = fib(n-1) + fib(n-2)`, what is the time complexity?",
        options: [
          "O(n)",
          "O(log n)",
          "O(2^n) exponential",
          "O(n^2)"
        ],
        correct: 2,
        explanation: "Naive Fibonacci branches into two recursive calls at every level, creating a binary recursion tree of depth n with roughly 2^n operations."
      },
      {
        question: "What is 'Tail Recursion' in modern programming languages?",
        options: [
          "When the recursive call is the very last operation executed before returning",
          "When recursion begins from the end of an array backwards",
          "When two functions call each other reciprocally",
          "When recursion is replaced by an infinite generator"
        ],
        correct: 0,
        explanation: "In tail recursion, the function performs no further calculations after the recursive call, allowing smart compilers (Tail Call Optimization) to reuse the current stack frame."
      },
      {
        question: "In what order do recursive function calls resolve when returning values?",
        options: [
          "First-In, First-Out (FIFO)",
          "Last-In, First-Out (LIFO)",
          "Random execution order",
          "Priority Queue sorting"
        ],
        correct: 1,
        explanation: "The system call stack operates strictly on LIFO order: the most recently invoked call frame finishes and resolves first."
      }
    ],
    bossQuestions: [
      {
        question: "How does the auxiliary space complexity of an iterative tree traversal compare with a recursive tree traversal?",
        options: ["Iterative is O(1) always", "Recursive uses O(h) implicit stack space where h is tree height", "Both require O(n^2) space", "Recursive never uses memory"],
        correct: 1,
        explanation: "Recursive traversal utilizes O(h) memory on the call stack proportional to the maximum height of the tree."
      },
      {
        question: "What technique converts exponential naive recursion into linear O(n) runtime by caching previous results?",
        options: ["Memoization / Dynamic Programming", "Garbage Collection", "Paging", "Polymorphism"],
        correct: 0,
        explanation: "Memoization records the output of expensive recursive calls in a lookup table so identical subproblems are solved only once."
      },
      {
        question: "What is mutual or indirect recursion?",
        options: ["Function A calls Function B, which calls Function A", "A function calling itself 5 times", "Recursion inside SQL queries", "Recursion without any stack"],
        correct: 0,
        explanation: "Indirect recursion occurs when function A delegates to function B, which in turn calls function A, forming a cycle."
      },
      {
        question: "Which data structure is intrinsically tied to executing recursive operations under the hood?",
        options: ["Queue", "Stack", "Min Heap", "Hash Map"],
        correct: 1,
        explanation: "The CPU runtime environment utilizes an activation record stack (the Call Stack) to track function states during recursion."
      },
      {
        question: "What happens to local variables when a recursive function enters a deeper call level?",
        options: ["They are overwritten immediately", "A new set of variables is created in a new stack frame", "They turn into global variables", "They are moved to ROM"],
        correct: 1,
        explanation: "Each invocation allocates a separate, independent stack frame containing its own isolated copies of local variables and parameters."
      },
      {
        question: "Which algorithmic paradigm most commonly relies on recursive formulations?",
        options: ["Divide and Conquer", "Greedy approach exclusively", "Brute force search only", "Round Robin"],
        correct: 0,
        explanation: "Divide and Conquer (like Merge Sort or Quick Sort) decomposes a problem into sub-problems, recursively solves them, and combines their solutions."
      },
      {
        question: "What is the base case condition when recursively searching a Binary Search Tree for a value?",
        options: ["When root is null or root.val equals target", "When root has two children", "When height reaches 100", "When all leaves are deleted"],
        correct: 0,
        explanation: "You stop either when you find the target node or when you encounter null (meaning the key does not exist in the branch)."
      },
      {
        question: "Why might an iterative solution be preferred over a non-tail-recursive solution in resource-constrained embedded systems?",
        options: ["Iterative code is always shorter", "Iterative code avoids stack memory allocation overhead and prevents crashes", "Recursion cannot compute math", "Iterative code bypasses the CPU"],
        correct: 1,
        explanation: "In memory-limited hardware, deep recursion risks stack overflow crashes; iterative loops reuse fixed memory variables."
      },
      {
        question: "What is the recurrence relation for the classic Merge Sort algorithm?",
        options: ["T(n) = 2T(n/2) + O(n)", "T(n) = T(n-1) + O(1)", "T(n) = T(n/2) + O(1)", "T(n) = 3T(n/3) + O(n^2)"],
        correct: 0,
        explanation: "Merge sort divides the list into 2 halves (2T(n/2)) and performs linear O(n) work merging them back together."
      },
      {
        question: "If a recursion depth reaches 50,000 in Python, what typically happens?",
        options: ["The computer rebooting", "RecursionError: maximum recursion depth exceeded", "The OS allocates swap space forever", "It automatically converts to a loop"],
        correct: 1,
        explanation: "Python enforces a recursion guard limit (default 1000) to protect system memory from uncontrolled stack exhaustion."
      }
    ],
    flashcards: [
      { front: "What is the Base Case?", back: "The terminating condition in a recursive function that stops further recursive calls and initiates the return unwinding." },
      { front: "What is the Call Stack?", back: "The internal LIFO data structure that stores active subroutines, parameter values, and return addresses during execution." },
      { front: "Why does Stack Overflow happen?", back: "When recursive calls continue indefinitely without hitting a base case, consuming all available stack memory." },
      { front: "What is Tail Call Optimization (TCO)?", back: "A compiler optimization where a function whose last action is a recursive call reuses the current stack frame, avoiding extra memory usage." },
      { front: "What is the Feynman Technique?", back: "Learning by teaching a concept in plain, simple terms to identify gaps in your understanding." }
    ],
    memoryPairs: [
      { id: "m1", label: "Base Case", match: "Stops infinite recursion" },
      { id: "m2", label: "Call Stack", match: "LIFO memory frame manager" },
      { id: "m3", label: "Stack Overflow", match: "Memory crash from infinite depth" },
      { id: "m4", label: "Tail Recursion", match: "Last operation is self-call" }
    ]
  },
  {
    id: "normalization",
    title: "SQL Normalization (1NF to BCNF)",
    subject: "Database Management Systems (DBMS)",
    badge: "🗄️ DBMS & SQL",
    confidenceDefault: 2,
    difficulty: "Intermediate",
    summary: "Systematically structuring relational schemas to eliminate anomalies, reduce data redundancy, and ensure referential integrity.",
    robotExplanation: {
      intro: "Welcome to the Royal Archives! Today we arrange raw, messy data scrolls into impeccably normalized royal ledgers.",
      analogy: "Imagine an old royal library ledger where every time a knight borrows a sword, the librarian writes down the knight's full name, castle address, armor size, horse breed, sword serial number, and blacksmith phone number! If the knight moves castles, you have to update 500 rows (Update Anomaly). Normalization means keeping one 'Knights' registry and one 'Swords' registry, linking them neatly with an ID badge.",
      keyPoints: [
        "1NF (First Normal Form): Every column contains atomic (indivisible) values; no repeating groups or comma-separated lists.",
        "2NF (Second Normal Form): Must be in 1NF + no Partial Dependency (every non-key attribute depends on the ENTIRE composite primary key).",
        "3NF (Third Normal Form): Must be in 2NF + no Transitive Dependency (non-key attributes must not depend on other non-key attributes).",
        "BCNF (Boyce-Codd Normal Form): A stricter version of 3NF where for every functional dependency X → Y, X must be a Super Key."
      ],
      mnemonic: "The Golden Oath: 'All attributes must depend on the Key, the Whole Key, and Nothing but the Key, so help me Codd!'",
      interactivePrompt: "Check: If StudentID ➔ HostelID, and HostelID ➔ WardenName, Warden depends transitively on StudentID! That violates 3NF."
    },
    teachBackRubric: {
      targetAudience: "A junior apprentice who is designing a student enrollment database.",
      requiredKeywords: ["redundancy", "atomic", "key", "partial", "transitive", "anomaly"],
      idealAnswerSummary: "Database normalization organizes tables to remove duplicate data and prevent update/delete anomalies using 1NF (atomic values), 2NF (no partial dependencies on composite keys), and 3NF (no transitive dependencies).",
      conceptChecklist: [
        { name: "Explained data redundancy / anomalies", weight: 25, regex: /redundancy|duplicate|anomaly|update|insert|delete/i },
        { name: "Described 1NF (atomic / single values)", weight: 25, regex: /1\s*nf|first\s*normal|atomic|indivisible|repeating/i },
        { name: "Described 2NF (no partial key dependence)", weight: 25, regex: /2\s*nf|second\s*normal|partial|composite\s*key|whole\s*key/i },
        { name: "Described 3NF or BCNF (no transitive chain)", weight: 25, regex: /3\s*nf|third\s*normal|transitive|bcnf|super\s*key|codd/i }
      ]
    },
    quizQuestions: [
      {
        question: "What fundamental rule satisfies First Normal Form (1NF)?",
        options: [
          "Tables must have a foreign key to an external warehouse",
          "Every column must hold atomic, indivisible values with no repeating groups",
          "All queries must execute in under 10 milliseconds",
          "No table can contain more than 10 columns"
        ],
        correct: 1,
        explanation: "1NF requires that each table cell contains exactly one single scalar value, completely disallowing arrays or multi-valued lists."
      },
      {
        question: "When does a table violate Second Normal Form (2NF)?",
        options: [
          "When it contains text columns with uppercase letters",
          "When a non-prime attribute depends on only a portion of a composite primary key",
          "When two rows have identical dates",
          "When there is no index created on the table"
        ],
        correct: 1,
        explanation: "2NF eliminates partial dependency. If a composite key is (StudentID, CourseID), course name depending solely on CourseID violates 2NF."
      },
      {
        question: "A relation is in 2NF and has dependency: StudentID ➔ MajorID, and MajorID ➔ MajorDepartmentHead. Which normal form is violated?",
        options: [
          "1NF",
          "2NF",
          "3NF",
          "It violates no normal forms"
        ],
        correct: 2,
        explanation: "This is a classic Transitive Dependency (A ➔ B and B ➔ C). 3NF strictly forbids non-prime attributes determining other non-prime attributes."
      },
      {
        question: "What is the famous mnemonic quote by database theorist Bill Kent regarding 3NF?",
        options: [
          "'Write data once, read everywhere'",
          "'The Key, the Whole Key, and Nothing but the Key, so help me Codd'",
          "'Normal tables are always smaller tables'",
          "'Index early, query often'"
        ],
        correct: 1,
        explanation: "The key corresponds to 1NF (has a key), the whole key to 2NF (no partial dependency), and nothing but the key to 3NF (no transitive dependency)."
      },
      {
        question: "What distinction separates BCNF from standard 3NF?",
        options: [
          "BCNF requires NoSQL support",
          "In BCNF, for every functional dependency X ➔ Y, X MUST be a Super Key",
          "BCNF allows multi-valued dependencies",
          "BCNF only applies to tables with fewer than 100 rows"
        ],
        correct: 1,
        explanation: "BCNF is a stricter variant where the determinant X in any functional dependency X ➔ Y must be a candidate/super key, even if Y is a prime attribute."
      }
    ],
    bossQuestions: [
      {
        question: "What is an 'Insertion Anomaly' in an unnormalized database?",
        options: ["Inability to record an entity without falsely inventing another related entity", "SQL syntax error on INSERT", "Disk running out of storage", "Primary key incrementing by 2"],
        correct: 0,
        explanation: "An insertion anomaly happens when you cannot add a record (e.g. a new course) without simultaneously assigning a student to it."
      },
      {
        question: "What trade-off is commonly introduced by decomposing tables into BCNF?",
        options: ["Higher storage costs", "Potential loss of functional dependency preservation", "Loss of ACID properties", "Inability to use foreign keys"],
        correct: 1,
        explanation: "Decomposition into 3NF always preserves dependencies and lossless joins, whereas BCNF may sometimes sacrifice dependency preservation."
      },
      {
        question: "Which normal form addresses Multi-Valued Dependencies (MVD) such as Employee ➔➔ Skills and Employee ➔➔ Languages?",
        options: ["2NF", "3NF", "4NF (Fourth Normal Form)", "5NF"],
        correct: 2,
        explanation: "4NF eliminates multi-valued dependencies where independent multiple attributes are bundled into the same relation."
      },
      {
        question: "What is the primary operational consequence of over-normalizing a relational schema in production?",
        options: ["Loss of data integrity", "Excessive SQL JOIN operations impacting read query latency", "Corrupted B-Trees", "Tables getting deleted automatically"],
        correct: 1,
        explanation: "High normalization splits data into numerous smaller tables; rebuilding records requires multiple JOINs, reducing read query performance."
      },
      {
        question: "What is Denormalization and when is it intentionally applied?",
        options: ["Purposely corrupting data", "Introducing controlled redundancy to accelerate heavy analytical read queries", "Reverting SQL back to flat text files", "Deleting unused foreign keys"],
        correct: 1,
        explanation: "Data warehouses and read-heavy systems denormalize schemas (e.g., star/snowflake schemas) to minimize expensive JOINs."
      },
      {
        question: "If relation R(A, B, C) has Candidate Keys {A} and {B}, and dependency C ➔ B exists, is R in 3NF? In BCNF?",
        options: ["In neither", "In 3NF (B is prime), but NOT in BCNF (C is not a super key)", "In BCNF only", "In both 3NF and BCNF"],
        correct: 1,
        explanation: "In 3NF, C ➔ B is permitted because B is part of a candidate key. But in BCNF, C must be a super key, which it is not!"
      },
      {
        question: "What mathematical property ensures that when two decomposed tables are joined back, no spurious rows are created?",
        options: ["Lossless Join Property", "Dependency Transitivity", "Cartesian Multiplication", "Referential Reflection"],
        correct: 0,
        explanation: "A lossless decomposition guarantees that natural joining the decomposed tables reconstructs the exact original relation without ghost rows."
      },
      {
        question: "Which of the following describes a 'Deletion Anomaly'?",
        options: ["Deleting one student record inadvertently obliterates all information about a course", "DELETE statements taking too long", "Hard disk failure", "Foreign key constraints rejecting drops"],
        correct: 0,
        explanation: "When multiple concepts share a row, deleting an entity (e.g., the last student in a department) accidentally erases the department itself."
      },
      {
        question: "What constitutes a 'Super Key'?",
        options: ["Any single integer column", "A set of attributes that uniquely identifies every tuple in a relation", "A password encrypted key", "An auto-incrementing identity only"],
        correct: 1,
        explanation: "A Super Key is any superset of attributes whose combined values uniquely identify each distinct row in a table."
      },
      {
        question: "Who formulated the relational model and the initial normal forms (1NF, 2NF, 3NF)?",
        options: ["Alan Turing", "Edgar F. 'Ted' Codd", "Tim Berners-Lee", "Grace Hopper"],
        correct: 1,
        explanation: "Edgar F. Codd introduced the relational database model and defined 1NF, 2NF, and 3NF at IBM in the 1970s."
      }
    ],
    flashcards: [
      { front: "What is 1NF?", back: "First Normal Form: All column values must be atomic (no lists) and each record must be unique." },
      { front: "What is 2NF?", back: "Second Normal Form: Must be in 1NF and have NO partial dependencies on composite primary keys." },
      { front: "What is 3NF?", back: "Third Normal Form: Must be in 2NF and have NO transitive dependencies (non-key determining non-key)." },
      { front: "What is BCNF?", back: "Boyce-Codd Normal Form: Stricter than 3NF. For every X ➔ Y, X must be a Super Key." },
      { front: "What is an Update Anomaly?", back: "A data inconsistency caused by data redundancy, where modifying data in one place leaves conflicting old copies elsewhere." }
    ],
    memoryPairs: [
      { id: "m5", label: "1NF", match: "Atomic scalar values only" },
      { id: "m6", label: "2NF", match: "Eliminates partial dependencies" },
      { id: "m7", label: "3NF", match: "Eliminates transitive dependencies" },
      { id: "m8", label: "BCNF", match: "Every determinant is a Super Key" }
    ]
  },
  {
    id: "bayes",
    title: "Bayes' Theorem & Probability",
    subject: "Mathematics & Statistics",
    badge: "📐 Mathematics",
    confidenceDefault: 2,
    difficulty: "Advanced",
    summary: "Updating the probability of a hypothesis as new evidence or data becomes available.",
    robotExplanation: {
      intro: "Greetings, royal mathematician! Let us illuminate Bayes' Theorem—the mathematical compass for reasoning under uncertainty.",
      analogy: "Imagine you are a royal guard and your detector dog barks when smelling rare dragon fire powder. Dragon fire powder is rare (1 in 1,000 bags). Even if the dog is 99% accurate, because true powder is so rare, most barks will actually be false alarms! Bayes' Theorem lets you calculate the TRUE probability given prior rarity and new evidence.",
      keyPoints: [
        "P(A|B) = [P(B|A) * P(A)] / P(B)",
        "Prior Probability P(A): What you believed before observing the new evidence.",
        "Likelihood P(B|A): The probability of seeing this evidence IF hypothesis A is true.",
        "Posterior Probability P(A|B): Your updated belief in hypothesis A AFTER observing evidence B.",
        "Evidence P(B): Total probability of seeing the evidence across all possibilities."
      ],
      mnemonic: "Think 'P.L.E.P.' ➜ Prior × Likelihood divided by Evidence yields Posterior!",
      interactivePrompt: "Formula: P(Disease | Positive Test) = [P(Positive | Disease) × P(Disease)] / P(Positive Total)."
    },
    teachBackRubric: {
      targetAudience: "A curious royal investigator assessing medical or security evidence.",
      requiredKeywords: ["prior", "posterior", "evidence", "likelihood", "update", "probability"],
      idealAnswerSummary: "Bayes' Theorem updates the probability of a hypothesis (posterior) based on prior knowledge and new evidence by multiplying the prior by likelihood and dividing by total evidence probability.",
      conceptChecklist: [
        { name: "Mentioned Prior probability (initial belief)", weight: 25, regex: /prior|initial|before|background/i },
        { name: "Mentioned Likelihood (evidence given hypothesis)", weight: 25, regex: /likelihood|chance\s*of\s*evidence|if\s*true/i },
        { name: "Mentioned Posterior (updated belief)", weight: 25, regex: /posterior|updated|after|final\s*probability/i },
        { name: "Gave formula or intuition on false positives/evidence", weight: 25, regex: /p\(|formula|evidence|false\s*positive|base\s*rate/i }
      ]
    },
    quizQuestions: [
      {
        question: "In Bayes' Theorem P(A|B) = [P(B|A) * P(A)] / P(B), what is P(A|B) called?",
        options: [
          "Prior probability",
          "Posterior probability",
          "Marginal likelihood",
          "Null hypothesis"
        ],
        correct: 1,
        explanation: "P(A|B) is the Posterior probability: the updated probability of event A occurring given that evidence B has been observed."
      },
      {
        question: "What term describes P(A) before any new evidence is gathered?",
        options: [
          "Posterior belief",
          "Prior probability",
          "Odds ratio",
          "Standard deviation"
        ],
        correct: 1,
        explanation: "P(A) is the Prior probability: our existing baseline belief in event A before considering new diagnostic evidence."
      },
      {
        question: "A rare disease affects 0.1% of the population. A test is 99% accurate. Why might a positive test NOT mean a 99% chance of having the disease?",
        options: [
          "Because doctors make clerical errors",
          "Because the base rate is so low that false positives outnumber true positives",
          "Because probabilities cannot exceed 50%",
          "Because Bayes' Theorem only applies to dice rolls"
        ],
        correct: 1,
        explanation: "This is the classic Base Rate Fallacy. With 1 in 1000 sick, in 10,000 people 10 are sick (all 10 test positive), while ~100 healthy people test false positive."
      },
      {
        question: "What is the denominator P(B) in Bayes' formula formally known as?",
        options: [
          "Marginal probability or total evidence probability",
          "Hypothetical variance",
          "Conditioning factor",
          "Degrees of freedom"
        ],
        correct: 0,
        explanation: "P(B) is the marginal probability of the evidence, acting as a normalizing constant so the posterior sums to 1."
      },
      {
        question: "Which machine learning classifier relies directly on Bayes' Theorem with an assumption of feature independence?",
        options: [
          "Support Vector Machine",
          "Naive Bayes Classifier",
          "Random Forest",
          "K-Means Clustering"
        ],
        correct: 1,
        explanation: "The Naive Bayes classifier applies Bayes' Theorem with the 'naive' assumption that all input features are mutually independent."
      }
    ],
    bossQuestions: [
      {
        question: "How is the denominator P(B) expanded using the Law of Total Probability when hypotheses A1 and A2 partition sample space?",
        options: ["P(B) = P(B|A1)P(A1) + P(B|A2)P(A2)", "P(B) = P(A1) * P(A2)", "P(B) = P(B|A1) / P(B|A2)", "P(B) = 1 - P(A1)"],
        correct: 0,
        explanation: "The Law of Total Probability computes P(B) as the weighted sum of B occurring across all disjoint hypotheses."
      },
      {
        question: "What happens in Bayesian updating when you acquire new evidence sequentially over time?",
        options: ["The previous posterior becomes the new prior for the next update", "You must discard all previous data", "The probability resets to zero", "Only the newest evidence is retained"],
        correct: 0,
        explanation: "In sequential Bayesian updating, yesterday's posterior belief naturally serves as today's prior belief when new observations arrive."
      },
      {
        question: "What is a 'Conjugate Prior' in Bayesian inference?",
        options: ["A prior distribution that yields a posterior in the same probability distribution family", "A prior equal to 0.5", "A prior that disproves evidence", "A uniform distribution only"],
        correct: 0,
        explanation: "When prior and posterior distributions belong to the same algebraic family (e.g. Beta prior with Binomial likelihood yields Beta posterior), they are conjugate."
      },
      {
        question: "What philosophical distinction separates Frequentist from Bayesian probability?",
        options: ["Frequentists view probability as long-run frequency; Bayesians view it as a degree of belief updated by evidence", "Frequentists only use computers", "Bayesians do not believe in math", "Frequentists reject random variables"],
        correct: 0,
        explanation: "Frequentists interpret probability strictly as the limit of relative frequency in repeated trials; Bayesians interpret probability as quantifiable subjective belief."
      },
      {
        question: "If events A and B are statistically independent, what is P(A|B)?",
        options: ["P(A)", "P(B)", "0", "1"],
        correct: 0,
        explanation: "By definition of statistical independence, knowing that B occurred provides zero new information about A; thus P(A|B) = P(A)."
      },
      {
        question: "What is the 'Bayes Factor' in model selection?",
        options: ["The ratio of marginal likelihoods of two competing hypotheses given data", "The speed of calculation", "The p-value of a t-test", "The variance ratio"],
        correct: 0,
        explanation: "The Bayes factor evaluates relative evidence between two models: K = P(Data|M1) / P(Data|M2)."
      },
      {
        question: "In spam email filtering, why did Naive Bayes become historically celebrated?",
        options: ["It calculated word likelihoods extremely fast and categorized text effectively despite strong word correlations", "It deleted hard drives", "It prevented all viruses", "It ran without memory"],
        correct: 0,
        explanation: "Paul Graham popularized Naive Bayes spam filters in 2002 because computing independent token probabilities was blazing fast and surprisingly accurate."
      },
      {
        question: "What happens if a prior probability P(A) is set strictly to zero in Bayesian statistics (Cromwell's Rule)?",
        options: ["No amount of contrary evidence can ever change the posterior from zero", "The calculation defaults to 1", "The posterior fluctuates wildly", "The system crashes"],
        correct: 0,
        explanation: "Cromwell's rule warns never to assign prior 0 or 1 to plausible claims, because multiplying by 0 prevents any amount of evidence from updating the belief."
      },
      {
        question: "What is the relationship between Odds and Probability?",
        options: ["Odds = Probability / (1 - Probability)", "Odds = Probability * 2", "Odds = 1 / Probability", "They are identical in all cases"],
        correct: 0,
        explanation: "If probability is 0.8 (80%), odds are 0.8 / 0.2 = 4:1."
      },
      {
        question: "Who was Thomas Bayes, and who actually formulated the modern mathematical theorem posthumously?",
        options: ["Thomas Bayes was an English statistician/minister; Pierre-Simon Laplace formalized the modern theorem", "Isaac Newton", "Carl Friedrich Gauss", "Blaise Pascal"],
        correct: 0,
        explanation: "Thomas Bayes wrote the essay in the 1700s, but it was the French polymath Pierre-Simon Laplace who independently discovered and generalized the formula."
      }
    ],
    flashcards: [
      { front: "What is Prior Probability?", back: "The baseline probability of an event before collecting new diagnostic evidence (P(A))." },
      { front: "What is Posterior Probability?", back: "The revised probability of an event after incorporating newly observed evidence (P(A|B))." },
      { front: "What is the Likelihood?", back: "The probability of observing the evidence given that the hypothesis is true (P(B|A))." },
      { front: "What is the Base Rate Fallacy?", back: "Ignoring how rare a condition is in general when interpreting positive test results." },
      { front: "What is Naive Bayes?", back: "A machine learning algorithm applying Bayes' theorem assuming all features are conditionally independent." }
    ],
    memoryPairs: [
      { id: "m9", label: "Prior", match: "Belief before evidence" },
      { id: "m10", label: "Posterior", match: "Belief after evidence" },
      { id: "m11", label: "Likelihood", match: "P(Evidence | Hypothesis)" },
      { id: "m12", label: "Naive Bayes", match: "Assumes independent features" }
    ]
  },
  {
    id: "quantum",
    title: "Quantum Superposition & Wave Duality",
    subject: "Modern Physics",
    badge: "⚛️ Physics",
    confidenceDefault: 2,
    difficulty: "Advanced",
    summary: "How quantum particles exist simultaneously across multiple states until measured, exhibiting both wave and particle characteristics.",
    robotExplanation: {
      intro: "Welcome, explorer of the subatomic realm! Today we examine Superposition—where particles defy classical intuition.",
      analogy: "Spin a golden coin on a royal marble tabletop. While it is spinning fast, is it Heads or is it Tails? It is a continuous blur of BOTH simultaneously! Only when you slap your palm down and stop the spin does it instantaneously snap ('collapse') into a definite single outcome.",
      keyPoints: [
        "Superposition: A quantum system can exist in a linear combination of multiple eigenstates until an observation takes place.",
        "Wave-Particle Duality: Light and matter exhibit wavelike interference when traveling, but particle-like localized detection.",
        "Wavefunction (Ψ): Mathematical description containing probabilities of all possible measurement outcomes.",
        "Wavefunction Collapse: The instantaneous reduction of the quantum state to a single eigenstate upon measurement."
      ],
      mnemonic: "Remember 'S.W.O.C.' ➜ Superposition Waves evolve smoothly until Observation Causes Collapse!",
      interactivePrompt: "Double Slit Experiment: Fire individual photons through two slits—they interfere with themselves like ocean waves!"
    },
    teachBackRubric: {
      targetAudience: "A fellow student trying to understand Schrödinger's Cat and quantum computing qubits.",
      requiredKeywords: ["superposition", "wave", "particle", "measurement", "collapse", "probability"],
      idealAnswerSummary: "Quantum particles behave like waves of probability existing in multiple states simultaneously (superposition) until an observation or measurement forces the wavefunction to collapse into one definite state.",
      conceptChecklist: [
        { name: "Explained simultaneous states (Superposition)", weight: 25, regex: /superposition|multiple\s*states|both|simultaneous|spinning\s*coin/i },
        { name: "Explained wave-particle duality or double slit", weight: 25, regex: /wave|particle|duality|double\s*slit|interference/i },
        { name: "Explained role of measurement / observation", weight: 25, regex: /measure|observ|look|detect/i },
        { name: "Explained wavefunction collapse or probability", weight: 25, regex: /collapse|wave\s*function|psi|probability|eigenstate/i }
      ]
    },
    quizQuestions: [
      {
        question: "What experiment definitively demonstrated the wave-particle duality of light and electrons?",
        options: [
          "The Millikan Oil Drop Experiment",
          "Young's Double-Slit Experiment",
          "The Michelson-Morley Interferometer",
          "The Rutherford Gold Foil Experiment"
        ],
        correct: 1,
        explanation: "Thomas Young's double-slit experiment revealed an interference pattern characteristic of waves, even when particles are fired one by one."
      },
      {
        question: "What does the square of the absolute value of the wavefunction |Ψ(x,t)|² represent in Born's rule?",
        options: [
          "The particle's exact gravitational mass",
          "The probability density of finding the particle at position x at time t",
          "The thermal speed of the photon",
          "The electrical charge inside the nucleus"
        ],
        correct: 1,
        explanation: "Max Born formulated that |Ψ|² represents the probability density of detecting the particle at a specific location."
      },
      {
        question: "Why did Erwin Schrödinger propose his famous 'cat in a box' thought experiment?",
        options: [
          "To prove that cats can live forever in quantum chambers",
          "To illustrate the apparent absurdity of applying quantum superposition directly to macroscopic everyday objects",
          "To train laboratory animals for physics demonstrations",
          "To disprove gravity"
        ],
        correct: 1,
        explanation: "Schrödinger devised the paradox to highlight the conceptual friction between quantum probabilities and macroscopic classical reality."
      },
      {
        question: "In quantum computing, how does a Qubit fundamentally differ from a classical Bit?",
        options: [
          "A qubit only exists when submerged in liquid nitrogen",
          "A classical bit is strictly 0 or 1, whereas a qubit can exist in a superposition of |0⟩ and |1⟩",
          "A qubit stores text instead of numbers",
          "A qubit can never be measured"
        ],
        correct: 1,
        explanation: "A qubit can be in state α|0⟩ + β|1⟩, enabling quantum algorithms to evaluate immense solution spaces in parallel."
      },
      {
        question: "What is Heisenberg's Uncertainty Principle?",
        options: [
          "You cannot precisely measure both the position and momentum of a particle simultaneously",
          "All measurements have a 5% margin of human error",
          "Particles change color when heated",
          "Time moves backwards in black holes"
        ],
        correct: 0,
        explanation: "Δx · Δp ≥ ℏ/2 establishes an intrinsic physical limit: the more accurately position is localized, the less certain momentum becomes."
      }
    ],
    bossQuestions: [
      {
        question: "What is Quantum Entanglement, famously termed 'spooky action at a distance' by Albert Einstein?",
        options: ["Particles whose quantum states are linked such that measuring one instantaneously determines the other regardless of separation", "Particles colliding at high speed", "Magnetic attraction between iron atoms", "Electrons bonding in a chemical covalent bond"],
        correct: 0,
        explanation: "Entangled particle pairs share a single composite wavefunction; measuring one collapses the state of both across arbitrary distances."
      },
      {
        question: "What did John Stewart Bell's Theorem and experimental Bell test inequalities prove?",
        options: ["Local hidden variable theories cannot explain quantum mechanics; nature is fundamentally non-local", "Light travels at infinite speed", "Photons possess rest mass", "Quantum physics is an optical illusion"],
        correct: 0,
        explanation: "Bell's inequalities demonstrated that no classical local hidden variable theory can reproduce quantum mechanical predictions."
      },
      {
        question: "What is Quantum Tunneling?",
        options: ["A particle penetrating a potential energy barrier higher than its kinetic energy due to wave nature", "Drilling atomic tunnels with lasers", "Electrons jumping through wormholes", "Sound waves traveling through rock"],
        correct: 0,
        explanation: "Because a particle's wavefunction extends beyond potential barriers, there is a non-zero probability it appears on the opposite side."
      },
      {
        question: "What modern electronic component relies directly on quantum mechanical tunneling to operate?",
        options: ["Flash NAND memory and tunnel diodes", "Mechanical relays", "Incandescent lightbulbs", "Lead-acid batteries"],
        correct: 0,
        explanation: "Flash memory writes and erases data by tunneling electrons through insulating oxide layers using quantum tunneling."
      },
      {
        question: "What is the De Broglie wavelength equation for any particle with momentum p?",
        options: ["λ = h / p", "λ = m * c^2", "λ = E / h", "λ = p^2 / 2m"],
        correct: 0,
        explanation: "Louis de Broglie showed that all matter has an associated wave of wavelength λ = h / p, where h is Planck's constant."
      },
      {
        question: "What is Quantum Decoherence?",
        options: ["Loss of quantum phase coherence when a system interacts with its surrounding thermal environment", "The splitting of an atomic nucleus", "Superconductors losing magnetism", "Photons turning into electrons"],
        correct: 0,
        explanation: "Decoherence explains how quantum superpositions rapidly leak information into the environment, yielding classical behavior."
      },
      {
        question: "Which interpretation of quantum mechanics posits that every measurement branches into parallel non-communicating universes?",
        options: ["Copenhagen Interpretation", "Many-Worlds Interpretation (Hugh Everett III)", "De Broglie-Bohm Pilot Wave", "Objective Collapse Theory"],
        correct: 1,
        explanation: "Hugh Everett's Many-Worlds interpretation argues that all possible alternate outcomes physically occur across an ever-branching multiverse."
      },
      {
        question: "What is the Photoelectric Effect and who won a Nobel Prize for explaining it using quantized light packets (photons)?",
        options: ["Albert Einstein in 1921", "Niels Bohr", "Max Planck", "Werner Heisenberg"],
        correct: 0,
        explanation: "Einstein demonstrated that light consists of discrete energy packets (photons E = hf) that eject electrons from metal surfaces."
      },
      {
        question: "In the Copenhagen interpretation, what physically triggers wavefunction collapse?",
        options: ["Macroscopic measurement / interaction with an observer apparatus", "The passage of 1 second", "A change in temperature only", "Nuclear fusion"],
        correct: 0,
        explanation: "Niels Bohr and Werner Heisenberg proposed that the act of observation by a classical apparatus collapses quantum possibilities."
      },
      {
        question: "What is a 'Pure State' versus a 'Mixed State' in quantum density matrix formalism?",
        options: ["A pure state can be written as a single state vector |Ψ⟩; a mixed state is a statistical ensemble of pure states", "Pure states are uncharged", "Mixed states have no energy", "Pure states contain only photons"],
        correct: 0,
        explanation: "A pure state corresponds to maximum possible information (Tr(ρ²) = 1), whereas mixed states reflect classical ignorance."
      }
    ],
    flashcards: [
      { front: "What is Superposition?", back: "The ability of a quantum system to exist in a linear combination of multiple states simultaneously until measured." },
      { front: "What is Wavefunction Collapse?", back: "The abrupt transition from a continuous spread of possibilities to a single definite eigenstate upon observation." },
      { front: "What is a Qubit?", back: "The basic unit of quantum information, capable of encoding 0, 1, or any superposition of both." },
      { front: "What is Heisenberg's Uncertainty Principle?", back: "It is physically impossible to simultaneously measure both the position and momentum of a particle with absolute precision (Δx·Δp ≥ ℏ/2)." },
      { front: "What is Quantum Tunneling?", back: "A particle passing through an energy barrier that it classically lacks sufficient kinetic energy to cross." }
    ],
    memoryPairs: [
      { id: "m13", label: "Superposition", match: "Multiple states simultaneously" },
      { id: "m14", label: "Wavefunction Ψ", match: "Probability amplitude wave" },
      { id: "m15", label: "Collapse", match: "Snap to definite state upon measurement" },
      { id: "m16", label: "Qubit", match: "Quantum computing data unit" }
    ]
  },
  {
    id: "virtual-memory",
    title: "Virtual Memory & Paging",
    subject: "Operating Systems",
    badge: "⚙️ Operating Systems",
    confidenceDefault: 2,
    difficulty: "Intermediate",
    summary: "How modern OS abstractions give each process the illusion of vast contiguous RAM through page tables, TLB, and swapping.",
    robotExplanation: {
      intro: "Welcome, system architect! Let us tour the Memory Management Unit (MMU) of the royal machine.",
      analogy: "Imagine an architect gives every royal scholar a personal blueprint with office numbers 1 to 1,000. In reality, the palace only has 100 physical desks! The Grand Librarian (MMU) maintains a secret Translation Directory (Page Table). When Scholar #4 asks for desk 42, the librarian looks up which physical desk is currently assigned. If a desk hasn't been used in hours, its papers are temporarily packed away in the basement archive (Disk Swap)!",
      keyPoints: [
        "Virtual vs Physical Address: Processes see continuous virtual address spaces, mapped to fragmented physical RAM frames.",
        "Page Table: The per-process translation directory mapping virtual Pages to physical Frames.",
        "Translation Lookaside Buffer (TLB): High-speed hardware cache inside CPU storing recent page translations.",
        "Page Fault: Hardware interrupt triggered when a requested page is not currently present in physical RAM.",
        "Page Replacement: Algorithms like LRU (Least Recently Used) and FIFO that decide which page to evict to disk swap."
      ],
      mnemonic: "Remember 'P.T.F.S.' ➜ Page Table Translates, Fault Swaps!",
      interactivePrompt: "Virtual Address = [ Page Number (p) | Offset (d) ]. Offset remains identical in physical memory!"
    },
    teachBackRubric: {
      targetAudience: "A junior systems programmer who wants to know why processes don't crash into each other in RAM.",
      requiredKeywords: ["virtual", "physical", "page", "frame", "table", "fault", "mmu"],
      idealAnswerSummary: "Virtual memory maps virtual pages to physical memory frames using page tables and the MMU, giving processes isolated address spaces and allowing swapping to disk when RAM is full via page faults.",
      conceptChecklist: [
        { name: "Explained Virtual vs Physical memory illusion", weight: 25, regex: /virtual|physical|illusion|address\s*space|isolate|protection/i },
        { name: "Explained Pages, Frames, and Page Table / MMU", weight: 25, regex: /page|frame|table|mmu|translation|map/i },
        { name: "Explained Page Fault & Disk Swapping", weight: 25, regex: /page\s*fault|swap|disk|hard\s*drive|evict/i },
        { name: "Explained TLB or replacement algorithms (LRU)", weight: 25, regex: /tlb|lru|cache|replacement|fifo/i }
      ]
    },
    quizQuestions: [
      {
        question: "What specialized hardware component translates virtual addresses into physical RAM addresses?",
        options: [
          "Arithmetic Logic Unit (ALU)",
          "Memory Management Unit (MMU)",
          "Direct Memory Access (DMA) controller",
          "BIOS chip"
        ],
        correct: 1,
        explanation: "The MMU (Memory Management Unit) is the hardware engine that intercepts virtual memory references and translates them using page tables."
      },
      {
        question: "What is a 'Page Fault'?",
        options: [
          "A physical hardware failure on a RAM stick",
          "An interrupt raised when an accessed page is not currently present in physical RAM",
          "A compiler syntax error in C++",
          "A corrupted hard disk sector"
        ],
        correct: 1,
        explanation: "A page fault is an architectural trap: the OS suspends the process, loads the missing page from disk storage into RAM, and resumes execution."
      },
      {
        question: "What is the primary role of the Translation Lookaside Buffer (TLB)?",
        options: [
          "A hardware cache holding recent virtual-to-physical address translations to speed up memory access",
          "A backup battery for CMOS",
          "An audio buffer for sound cards",
          "A queue for pending printer jobs"
        ],
        correct: 0,
        explanation: "The TLB is an ultra-fast associative cache in the CPU that bypasses multi-level page table lookups when an address translation hits."
      },
      {
        question: "What dangerous OS phenomenon occurs when a computer spends more time swapping pages in and out than executing instructions?",
        options: [
          "Thrashing",
          "Starvation",
          "Deadlock",
          "Clock drift"
        ],
        correct: 0,
        explanation: "Thrashing occurs when the working sets of active processes exceed available physical RAM, causing continuous page fault disk thrashing."
      },
      {
        question: "Which page replacement algorithm evicts the page that has not been referenced for the longest period of time?",
        options: [
          "First In First Out (FIFO)",
          "Least Recently Used (LRU)",
          "Optimal Page Replacement (OPT)",
          "Random Eviction"
        ],
        correct: 1,
        explanation: "LRU tracks temporal locality and evicts the page unaccessed for the longest duration, assuming past behavior predicts near future."
      }
    ],
    bossQuestions: [
      {
        question: "Why do modern 64-bit operating systems use Multi-Level Page Tables instead of a single flat page table?",
        options: ["A flat 64-bit table would consume petabytes of memory; multi-level tables allocate space only for active memory regions", "Flat tables are illegal in POSIX", "Multi-level tables speed up disk drives", "64-bit CPUs do not support arrays"],
        correct: 0,
        explanation: "A single flat 64-bit page table would require millions of gigabytes just to store metadata; multi-level hierarchies skip non-allocated regions."
      },
      {
        question: "What is Belady's Anomaly in page replacement theory?",
        options: ["A situation where increasing the number of page frames leads to MORE page faults under FIFO replacement", "A bug in Linux kernel 2.4", "LRU running in O(1) time", "CPUs overheating during swap"],
        correct: 0,
        explanation: "Laszlo Belady proved in 1969 that under FIFO, allocating more RAM frames can paradoxically increase total page fault count."
      },
      {
        question: "What is the 'Working Set' model introduced by Peter Denning?",
        options: ["The set of pages actively referenced by a process during a sliding recent time window Δ", "The list of installed applications", "The total size of the swap file", "The count of CPU cores"],
        correct: 0,
        explanation: "Denning's working set model defines memory needed to prevent thrashing by keeping each process's active working pages resident in RAM."
      },
      {
        question: "How does Inverted Page Table architecture differ from traditional per-process page tables?",
        options: ["It has one entry per physical frame in RAM rather than per virtual page across processes", "It inverts bits from 1 to 0", "It is stored on magnetic tape", "It requires no MMU"],
        correct: 0,
        explanation: "Inverted page tables scale with physical RAM size rather than virtual address space, mapping physical frames back to (PID, Virtual Page)."
      },
      {
        question: "What is Copy-on-Write (COW) during process creation via `fork()` in Unix?",
        options: ["Parent and child share the same physical pages read-only until one writes to a page, triggering a duplicate copy", "Copying files to disk before executing", "Printing terminal output to paper", "Encrypting memory blocks"],
        correct: 0,
        explanation: "COW optimizes process spawning by sharing read-only page frames until modification occurs, avoiding unnecessary memory duplication."
      },
      {
        question: "What is an address 'Offset' in paging?",
        options: ["The exact byte location within a specific page, remaining identical in both virtual and physical frames", "The delay in internet connections", "The PID of the parent process", "The size of the hard drive"],
        correct: 0,
        explanation: "Since page sizes are powers of two (e.g. 4KB = 2^12), the low 12 bits identify the byte offset within the page and physical frame."
      },
      {
        question: "What is Internal Fragmentation in paging systems?",
        options: ["Wasted unused space within the last allocated page frame of a process", "Memory scattered across multiple RAM chips", "Fragmented hard drive sectors", "Broken pointers in C code"],
        correct: 0,
        explanation: "If a process requests 5KB with 4KB pages, it is allocated two 4KB pages (8KB total), leaving 3KB of wasted internal space in the second page."
      },
      {
        question: "What flag in a page table entry indicates whether a page has been modified since being loaded into RAM?",
        options: ["Dirty Bit / Modified Bit", "Valid/Invalid Bit", "Execution Bit", "Cache Disable Bit"],
        correct: 0,
        explanation: "The Dirty Bit records write operations; if set when the page is evicted, the OS must write the modified page back to disk storage."
      },
      {
        question: "What does the NX (No-Execute) or W^X (Write XOR Execute) memory protection bit enforce?",
        options: ["Memory pages marked writable cannot be executed as code, mitigating buffer overflow exploits", "Programs cannot write to disk", "CPUs only run 1 task per minute", "RAM cannot be upgraded"],
        correct: 0,
        explanation: "The NX bit prevents malicious code injected into data buffers or stack memory from being executed by the instruction pointer."
      },
      {
        question: "What theoretical page replacement algorithm yields the absolute minimum possible number of page faults?",
        options: ["OPT / MIN (Belady's Optimal Algorithm)", "First In First Out (FIFO)", "Least Recently Used (LRU)", "Most Frequently Used (MFU)"],
        correct: 0,
        explanation: "Belady's Optimal algorithm replaces the page that will not be used for the longest period in the future (impossible in practice without clairvoyance)."
      }
    ],
    flashcards: [
      { front: "What is the Page Table?", back: "A data structure maintained by the OS mapping virtual pages to physical memory frames." },
      { front: "What is a Page Fault?", back: "A hardware trap raised when an accessed virtual page is not loaded in physical RAM." },
      { front: "What is the TLB?", back: "Translation Lookaside Buffer: A high-speed CPU cache storing recent virtual-to-physical address mappings." },
      { front: "What is Thrashing?", back: "When the system spends excessive CPU cycles swapping pages in and out of disk rather than running tasks." },
      { front: "What is the Dirty Bit?", back: "A flag in the page table entry indicating whether a memory page was modified while in RAM." }
    ],
    memoryPairs: [
      { id: "m17", label: "MMU", match: "Hardware address translation" },
      { id: "m18", label: "Page Fault", match: "Triggers disk swap into RAM" },
      { id: "m19", label: "TLB", match: "High-speed address cache" },
      { id: "m20", label: "Thrashing", match: "Excessive swapping degrades system" }
    ]
  },
  {
    id: "bst",
    title: "Binary Search Trees & Balancing",
    subject: "Data Structures & Algorithms",
    badge: "🌲 Data Structures",
    confidenceDefault: 2,
    difficulty: "Intermediate",
    summary: "Hierarchical sorted data structures and self-balancing mechanisms (AVL / Red-Black) that guarantee O(log n) search time.",
    robotExplanation: {
      intro: "Step into the Royal Arbor! Let us tend to the Binary Search Tree—a majestic branching structure of sorted wisdom.",
      analogy: "Imagine a royal genealogy tree where at every fork, any descendant with a lower number walks to the Left wing, and anyone with a higher number walks to the Right wing. To find any noble in a library of 1,000,000 citizens, you only make ~20 left-or-right choices! But if you add sorted names blindly (1, 2, 3, 4...), the tree turns into a sad, thin stick (a linked list), ruining your search speed.",
      keyPoints: [
        "BST Invariant: For any node X, all values in its Left Subtree are < X, and all values in its Right Subtree are > X.",
        "Inorder Traversal: Traversing (Left, Root, Right) always prints the keys in strictly ascending sorted order.",
        "Degeneracy: Inserting pre-sorted items degrades the tree into a linked list of height O(n), spoiling O(log n) efficiency.",
        "Self-Balancing (AVL / Red-Black): Rotations (Left & Right) dynamically rebalance heights during inserts and deletes."
      ],
      mnemonic: "Remember 'L.R.R.' ➜ Left is Lesser, Right is Risin', Rotations Keep Balancin'!",
      interactivePrompt: "AVL Balance Factor = Height(Left Subtree) - Height(Right Subtree). Must stay within {-1, 0, +1}!"
    },
    teachBackRubric: {
      targetAudience: "A peer preparing for coding interviews who needs clear intuition on tree balancing.",
      requiredKeywords: ["left", "right", "bst", "balance", "height", "log", "rotation"],
      idealAnswerSummary: "A Binary Search Tree places smaller values left and larger values right, giving O(log n) operations when balanced, but degrades to O(n) unless self-balanced via AVL or Red-Black rotations.",
      conceptChecklist: [
        { name: "Explained BST Ordering Property (Left < Root < Right)", weight: 25, regex: /left|right|less|greater|smaller|larger|order/i },
        { name: "Explained Search Time Complexity (O(log n) vs O(n))", weight: 25, regex: /o\(log\s*n\)|logarithmic|height|o\(n\)|linear|skew/i },
        { name: "Explained Tree Degeneracy / Skewing", weight: 25, regex: /degrade|skew|linked\s*list|stick|unbalance|sorted/i },
        { name: "Explained Self-Balancing / Tree Rotations (AVL/Red-Black)", weight: 25, regex: /rotat|avl|red-?black|balance\s*factor|rebalance/i }
      ]
    },
    quizQuestions: [
      {
        question: "Which traversal of a Binary Search Tree produces values in strictly ascending sorted order?",
        options: [
          "Preorder (Root, Left, Right)",
          "Inorder (Left, Root, Right)",
          "Postorder (Left, Right, Root)",
          "Level Order (BFS)"
        ],
        correct: 1,
        explanation: "Inorder traversal visits the left subtree (smaller), then current node, then right subtree (larger), yielding sorted order."
      },
      {
        question: "What is the worst-case time complexity of searching an unbalanced BST with n elements?",
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n log n)"
        ],
        correct: 2,
        explanation: "If elements were inserted in sorted order, the BST becomes a degenerate skewed stick (linked list), requiring O(n) search time."
      },
      {
        question: "In an AVL tree, what is the maximum allowed difference in height between left and right subtrees (Balance Factor)?",
        options: [
          "0 only",
          "1 (-1, 0, or +1)",
          "2",
          "log(n)"
        ],
        correct: 1,
        explanation: "An AVL tree maintains strict balance: for every node, the height difference between left and right subtrees must be at most 1."
      },
      {
        question: "What fundamental operation restores balance to an unbalanced BST without violating the BST ordering property?",
        options: [
          "Tree Rotation (Left and Right rotations)",
          "Heapifying down",
          "Deleting the root",
          "Quicksort partitioning"
        ],
        correct: 0,
        explanation: "Tree rotations rearrange pointers to adjust subtree heights while preserving the invariant that Left < Root < Right."
      },
      {
        question: "Which self-balancing binary search tree is standardly used inside C++ `std::map` and Java `TreeMap`?",
        options: [
          "Splay Tree",
          "Red-Black Tree",
          "B-Tree",
          "Trie"
        ],
        correct: 1,
        explanation: "Red-Black trees offer slightly faster insertion and deletion with fewer rotations than AVL trees, making them the standard choice for language libraries."
      }
    ],
    bossQuestions: [
      {
        question: "In a Red-Black Tree, what color must the root node always be?",
        options: ["Black", "Red", "Either red or black", "Transparent"],
        correct: 0,
        explanation: "One of the fundamental invariants of a Red-Black tree is that the root node must always be colored black."
      },
      {
        question: "Can two consecutive red nodes ever appear along any path in a valid Red-Black Tree?",
        options: ["Yes, if both have black children", "No, red nodes cannot have red children", "Only in the left subtree", "Only during search queries"],
        correct: 1,
        explanation: "The 'Red Property' forbids two consecutive red nodes; if a node is red, its children must be black."
      },
      {
        question: "What is the Black-Height property in a Red-Black tree?",
        options: ["Every path from a node to any of its descendant null leaves must contain the exact same number of black nodes", "The root must be 100 pixels tall", "The tree height must equal black node count", "All leaves are red"],
        correct: 0,
        explanation: "Equal black-height ensures that no single path is more than twice as long as any other path, bounding height to 2 log(n + 1)."
      },
      {
        question: "When an AVL node experiences a Left-Right (LR) imbalance, how is it restored?",
        options: ["A single Left rotation", "A Left rotation on the left child, followed by a Right rotation on the node", "A single Right rotation", "Rebuilding the whole tree from scratch"],
        correct: 1,
        explanation: "A double rotation (Left-Right) transforms the zigzag configuration into a straight line before performing the final right rotation."
      },
      {
        question: "What is the successor of a node in a BST that has a non-empty right subtree?",
        options: ["The right child itself", "The minimum (leftmost) node in the right subtree", "The root of the tree", "The parent node"],
        correct: 1,
        explanation: "The in-order successor of a node with a right subtree is the smallest value greater than it, found by taking one step right, then going all the way left."
      },
      {
        question: "How do B-Trees and B+ Trees expand on Binary Search Trees for disk-based database indexes?",
        options: ["Nodes hold hundreds of keys with high branching factors (fan-out), matching disk block sizes and minimizing I/O seeks", "They eliminate search keys", "They convert trees into hash tables", "They run in O(n^2) time"],
        correct: 0,
        explanation: "B-Trees have massive branching factors (e.g. 500 children per node), allowing billions of records to be indexed in just 3-4 disk block seeks."
      },
      {
        question: "What is a 'Splay Tree' and what remarkable property does it possess?",
        options: ["A self-adjusting BST where recently accessed elements are rotated to the root, guaranteeing O(log n) amortized time", "A tree with 4 children per node", "A tree that never requires rotations", "A tree designed exclusively for graphics"],
        correct: 0,
        explanation: "Invented by Sleator and Tarjan, Splay Trees splay accessed items to the root, providing O(log n) amortized time without storing balance bits."
      },
      {
        question: "What is the space complexity of storing an n-node binary search tree?",
        options: ["O(log n)", "O(n)", "O(n^2)", "O(2^n)"],
        correct: 1,
        explanation: "Each of the n nodes stores its key/payload and two pointer references (left and right), yielding linear O(n) total space."
      },
      {
        question: "What is the worst-case number of rotations required to rebalance an AVL tree after an insertion?",
        options: ["At most 2 rotations (one single or one double rotation)", "O(log n) rotations", "O(n) rotations", "Zero rotations"],
        correct: 0,
        explanation: "Remarkably, inserting into an AVL tree requires at most one single or one double rotation to fully restore the AVL invariant up the path."
      },
      {
        question: "How many structurally distinct Binary Search Trees can be formed with n distinct keys?",
        options: ["n!", "2^n", "The n-th Catalan Number C_n = (2n)! / ((n+1)! * n!)", "n^2"],
        correct: 2,
        explanation: "The number of distinct BST topologies with n unique keys is given by the n-th Catalan number."
      }
    ],
    flashcards: [
      { front: "What is the BST Invariant?", back: "For any node, all keys in its left subtree are smaller, and all keys in its right subtree are larger." },
      { front: "What is the Balance Factor in AVL?", back: "Height(Left Subtree) - Height(Right Subtree). An AVL node must keep this in {-1, 0, +1}." },
      { front: "What is a Tree Rotation?", back: "An O(1) pointer restructuring that changes subtree heights without altering in-order element order." },
      { front: "Why are Red-Black Trees used in standard libraries?", back: "They guarantee O(log n) operations with fewer rebalancing rotations on insert/delete compared to strict AVL trees." },
      { front: "What does Inorder Traversal do on a BST?", back: "Visits Left, Node, Right, returning all keys in strictly sorted ascending order." }
    ],
    memoryPairs: [
      { id: "m21", label: "Inorder Traversal", match: "Outputs sorted ascending keys" },
      { id: "m22", label: "AVL Tree", match: "Strict balance factor {-1, 0, 1}" },
      { id: "m23", label: "Tree Rotation", match: "O(1) pointer swap balancing" },
      { id: "m24", label: "Red-Black Tree", match: "Balanced with colored node rules" }
    ]
  }
];

// Helper to get or clone topics
function getTopicById(id) {
  return DEFAULT_TOPICS.find(t => t.id === id) || DEFAULT_TOPICS[0];
}
