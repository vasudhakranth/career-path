from fastapi import APIRouter, HTTPException
from app.database.connection import db
from bson import ObjectId

router = APIRouter()


def slugify(value: str) -> str:
    return value.lower().replace("/", "-").replace(" ", "-")


def T(topic_id, title, level, subtopics, summary, explanation, code, examples, use_cases, interview_questions, practice):
    """Build one fully-populated topic entry (GeeksforGeeks-style: explanation, code, use
    cases, interview questions, and a practice problem — no generic placeholder text)."""
    return {
        "id": topic_id,
        "title": title,
        "level": level,
        "subtopics": subtopics,
        "summary": summary,
        "explanation": explanation,
        "code": code,
        "examples": examples,
        "useCases": use_cases,
        "interviewQuestions": interview_questions,
        "practice": practice,
        "videos": [],
    }


# ---------------------------------------------------------------------------
# PYTHON — 23 topics, beginner to advanced
# ---------------------------------------------------------------------------
PYTHON_TOPICS = [
    T(
        "python-intro", "Python Introduction", "Beginner",
        ["What is Python?", "Features", "History", "Applications", "Installation", "First Program"],
        "What Python is, why it's popular, and how to run your first script.",
        "Python is a high-level, interpreted, general-purpose language known for clean, readable syntax that "
        "uses indentation instead of curly braces. Code runs through an interpreter (CPython is the reference "
        "implementation), so there's no separate compile step, which is part of why it's popular for scripting, "
        "web development, data science, automation, and teaching.",
        "print('Hello, EduMind!')\nprint(3 + 5)",
        ["Print a greeting and a simple sum to the console"],
        ["Scripting and automation", "Web backends (Django/Flask)", "Data science and ML prototyping"],
        ["Why is Python called an interpreted language?", "What are some real-world applications of Python?"],
        "Install Python from python.org, then write a script that prints your name and today's date using the datetime module.",
    ),
    T(
        "python-basics", "Python Basics", "Beginner",
        ["Variables", "Keywords & Identifiers", "Comments", "Input/Output", "Type Conversion"],
        "Declaring variables, naming rules, and converting between types.",
        "Variables are created the moment you assign a value — Python is dynamically typed, so you never declare "
        "a type up front. Keywords like if, for, and def are reserved and can't be used as variable names, while "
        "identifiers are the names you choose for variables, functions, and classes.",
        "name = 'EduMind'\nage = 3\nprint(f'{name} is {age} years old')\nage = age + 1\nprint(type(age))",
        ["Combine a string and number with an f-string", "Check a variable's type with type()"],
        ["Reading user input for a CLI tool", "Converting form input strings to numbers", "Building config values from environment variables"],
        ["What's the difference between a keyword and an identifier?", "How does Python's dynamic typing differ from static typing?"],
        "Write a script that reads a Celsius temperature with input(), converts it to Fahrenheit, and prints the result to one decimal place.",
    ),
    T(
        "data-types", "Data Types", "Beginner",
        ["Numbers", "Strings", "Lists", "Tuples", "Sets", "Dictionaries", "Booleans"],
        "Python's built-in types and when to use each one.",
        "Python's built-in types cover numbers (int, float, complex), text (str), ordered collections (list, "
        "tuple), unique collections (set), key-value mappings (dict), and booleans. Picking the right one — a "
        "list for an ordered, changeable sequence versus a tuple for one that shouldn't change — affects both "
        "correctness and performance.",
        "scores = [88, 92, 79]\ninfo = ('Alice', 21)\ntags = {'python', 'web', 'python'}\nprofile = {'name': 'Alice', 'score': 88}\nprint(scores, info, tags, profile)",
        ["Store the same data in a list, tuple, set, and dict to compare"],
        ["Choosing tuples for fixed config values", "Using sets to deduplicate data", "Using dicts to model JSON-like records"],
        ["When would you use a tuple instead of a list?", "Why can't a list be a dictionary key?"],
        "Create a dictionary for a student with a name, a list of grades, and a passed boolean, then print each value along with its type.",
    ),
    T(
        "operators", "Operators", "Beginner",
        ["Arithmetic", "Assignment", "Comparison", "Logical", "Identity", "Membership"],
        "Arithmetic, comparison, logical, and membership operators.",
        "Python has arithmetic operators (+, -, *, /, //, %, **), comparison operators (==, !=, <, >), logical "
        "operators (and, or, not), and identity/membership operators (is, in) that check object identity or "
        "collection membership rather than plain equality.",
        "a, b = 17, 5\nprint(a // b, a % b, a ** 2)\nprint(a > b and b > 0)\nprint(3 in [1, 2, 3])",
        ["Demonstrate floor division, modulo, and exponent together"],
        ["Pagination math with floor division", "Validating input ranges with comparisons", "Checking membership before a lookup"],
        ["What's the difference between == and is in Python?", "What does the // operator do differently from /?"],
        "Write a function that takes two numbers and prints the result of all six comparison operators applied to them.",
    ),
    T(
        "conditional", "Conditional Statements", "Beginner",
        ["if", "if-else", "elif", "Nested if", "match-case"],
        "Branching logic with if/elif/else and match-case.",
        "Conditional statements branch based on a boolean expression using if, optional elif blocks for extra "
        "conditions, and else as the fallback. Python 3.10+ also added match/case as a more readable alternative "
        "to long if-elif chains when matching a value against several patterns.",
        "score = 76\nif score >= 90:\n    grade = 'A'\nelif score >= 75:\n    grade = 'B'\nelse:\n    grade = 'C'\nprint(grade)",
        ["Assign a letter grade from a numeric score"],
        ["Form validation logic", "Feature flags / A-B branching", "Menu-driven CLI tools"],
        ["When would you prefer match-case over if-elif?", "What happens if no elif or else condition is met?"],
        "Assign a letter grade (A-F) using if-elif-else, then rewrite the same logic with match-case.",
    ),
    T(
        "loops", "Loops", "Beginner",
        ["for loop", "while loop", "break", "continue", "pass", "Nested loops"],
        "Repeating code with for and while, and controlling flow with break/continue.",
        "for loops iterate over a sequence a known number of times, while loops repeat as long as a condition is "
        "true. break exits a loop early, continue skips to the next iteration, and pass is a no-op placeholder "
        "used when a statement is syntactically required but shouldn't do anything yet.",
        "total = 0\nfor i in range(1, 6):\n    if i == 4:\n        continue\n    total += i\nprint(total)\n\ncount = 0\nwhile count < 3:\n    print('tick', count)\n    count += 1",
        ["Sum numbers 1-5 while skipping one value with continue"],
        ["Batch-processing items in a list", "Polling until a condition is met", "Building a retry mechanism"],
        ["What's the difference between break and continue?", "How would you avoid an infinite while loop?"],
        "Use a while loop to print the first 5 Fibonacci numbers as they're calculated.",
    ),
    T(
        "functions", "Functions", "Beginner",
        ["def", "Parameters & Arguments", "Return Values", "Default Params", "Lambda", "Recursion", "Scope"],
        "Defining reusable functions, default args, lambdas, and recursion.",
        "A function is defined with def, can take parameters (including default values), and sends a result "
        "back with return. Lambdas are small unnamed one-expression functions, recursion is a function calling "
        "itself on a smaller version of the problem, and scope determines where a variable is visible — local "
        "inside a function versus global outside it.",
        "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nsquare = lambda x: x * x\nprint(factorial(5), square(6))",
        ["Compute a factorial recursively and a square with a lambda"],
        ["Sorting with a custom lambda key", "Recursive tree/directory traversal", "Reusable validation helpers"],
        ["Why does every recursive function need a base case?", "What's the difference between local and global scope?"],
        "Write a recursive function for the nth Fibonacci number, then an iterative version, and compare their speed for n=30 with the time module.",
    ),
    T(
        "strings", "Strings", "Beginner",
        ["String Methods", "Indexing & Slicing", "f-strings", "Split & Join", "Regex Basics"],
        "Manipulating text with slicing, methods, and regular expressions.",
        "Strings are immutable character sequences that support indexing (s[0]), slicing (s[1:4]), and many "
        "built-in methods (.upper(), .split(), .replace()). f-strings are the modern way to format text, and "
        "the re module handles regular expressions for pattern matching.",
        "text = 'Learn Python with EduMind'\nprint(text[:5])\nprint(text.split(' '))\nprint(f'Length: {len(text)}')\nimport re\nprint(re.findall(r'[A-Z]\\w+', text))",
        ["Slice, split, and regex-match a sentence"],
        ["Parsing log files with regex", "Cleaning and normalizing user input", "Building formatted report strings"],
        ["Why are Python strings immutable?", "What's the difference between re.match and re.search?"],
        "Write a function that capitalizes every word in a sentence without using the built-in .title() method.",
    ),
    T(
        "lists", "Lists", "Beginner",
        ["Creating Lists", "List Methods", "Indexing & Slicing", "List Comprehension", "Nested Lists"],
        "Ordered, mutable sequences and comprehensions.",
        "Lists are ordered, mutable sequences made with square brackets, supporting methods like .append(), "
        ".sort(), and .remove(). List comprehensions build a new list compactly, and lists can nest to "
        "represent grids or tables.",
        "nums = [5, 2, 8, 1]\nnums.sort()\nsquares = [n * n for n in nums if n % 2 == 0]\nmatrix = [[1, 2], [3, 4]]\nprint(nums, squares, matrix[1][0])",
        ["Sort a list and build a filtered comprehension"],
        ["Filtering and transforming query results", "Building a 2D grid/board", "De-duplicating and reordering data"],
        ["What's the time complexity of appending to a list?", "How does .sort() differ from sorted()?"],
        "Given a list of student dicts (name, score), use a list comprehension to get the names of students who scored above 80.",
    ),
    T(
        "tuples", "Tuples", "Beginner",
        ["Creating Tuples", "Tuple Methods", "Packing & Unpacking", "Immutability"],
        "Fixed, ordered sequences and multiple assignment.",
        "Tuples are ordered, immutable sequences made with parentheses, often used for fixed collections like "
        "coordinates. Packing groups values into a tuple automatically, and unpacking assigns each element to "
        "its own variable in one line.",
        "point = (3, 4)\nx, y = point\nperson = 'Alice', 21, 'Engineer'\nname, age, role = person\nprint(x, y, name, age, role)",
        ["Pack and unpack coordinate and record data"],
        ["Returning multiple values from a function", "Using as dictionary keys (composite keys)", "Representing fixed records like coordinates"],
        ["Why are tuples hashable but lists aren't?", "How does a function return multiple values in Python?"],
        "Write min_max(numbers) that returns a (minimum, maximum) tuple, then unpack the result into two variables when calling it.",
    ),
    T(
        "sets", "Sets", "Beginner",
        ["Creating Sets", "Set Methods", "Union & Intersection", "Difference", "Symmetric Difference"],
        "Unique, unordered collections and set algebra.",
        "Sets are unordered collections of unique, hashable values, made with curly braces or set(). They "
        "support union (|), intersection (&), difference (-), and symmetric difference (^), useful for "
        "comparing groups and removing duplicates.",
        "python_devs = {'Alice', 'Bob', 'Cara'}\njs_devs = {'Bob', 'Dan'}\nprint(python_devs | js_devs)\nprint(python_devs & js_devs)\nprint(python_devs - js_devs)",
        ["Compare two groups of developers with set operations"],
        ["Removing duplicates from a dataset", "Finding common items between two lists", "Fast membership testing"],
        ["Why is checking membership in a set faster than in a list?", "What's the difference between union and intersection?"],
        "Given two lists of emails (webinar signups and newsletter subscribers), use sets to find who did both and who did only one.",
    ),
    T(
        "dictionaries", "Dictionaries", "Beginner",
        ["Creating Dicts", "Dict Methods", "Nested Dicts", "Looping", "Dict Comprehension"],
        "Key-value storage and fast lookups.",
        "Dictionaries store key-value pairs, created with curly braces, giving fast lookup by key instead of "
        "by position. They support nesting, iteration over keys/values/items, and comprehensions for building "
        "new dictionaries concisely.",
        "student = {'name': 'Alice', 'grades': {'math': 92, 'science': 88}}\nfor subject, score in student['grades'].items():\n    print(subject, score)\npassed = {k: v for k, v in student['grades'].items() if v >= 90}",
        ["Iterate a nested dict and filter it with a comprehension"],
        ["Modeling JSON API responses", "Counting word/item frequency", "Fast lookup tables (caches)"],
        ["What happens if you access a missing dict key with []?", "How do you safely get a value that might not exist?"],
        "Build a dictionary that counts how many times each word appears in a sentence, without using collections.Counter.",
    ),
    T(
        "file-handling", "File Handling", "Intermediate",
        ["open() & with", "Read/Write/Append", "CSV Files", "JSON Files"],
        "Reading and writing text, CSV, and JSON files safely.",
        "The built-in open() function reads and writes files, and using it with the with statement closes the "
        "file automatically even if an error occurs. The csv and json modules make it easy to read and write "
        "structured data in those common formats.",
        "with open('notes.txt', 'w') as f:\n    f.write('Learning EduMind\\n')\n\nwith open('notes.txt', 'r') as f:\n    print(f.read())\n\nimport json\ndata = {'skill': 'Python', 'level': 'Beginner'}\nwith open('data.json', 'w') as f:\n    json.dump(data, f)",
        ["Write, then read back, a text file and a JSON file"],
        ["Reading configuration files", "Exporting reports to CSV", "Persisting app data as JSON"],
        ["Why is `with open(...)` preferred over manually closing a file?", "What's the difference between file modes 'w' and 'a'?"],
        "Read a CSV file of student scores with the csv module and print the average score.",
    ),
    T(
        "exception-handling", "Exception Handling", "Intermediate",
        ["try/except", "finally", "raise", "Custom Exceptions"],
        "Catching, raising, and cleaning up after errors.",
        "try/except blocks catch errors that would otherwise crash the program, finally runs cleanup code "
        "whether or not an error occurred, and raise lets you trigger an exception manually — including "
        "custom exception classes defined by subclassing Exception.",
        "class InvalidScoreError(Exception):\n    pass\n\ndef check_score(score):\n    if score < 0 or score > 100:\n        raise InvalidScoreError('Score must be between 0 and 100')\n    return score\n\ntry:\n    check_score(150)\nexcept InvalidScoreError as e:\n    print('Error:', e)\nfinally:\n    print('Validation attempt finished')",
        ["Raise and catch a custom exception, with a finally block"],
        ["Validating API input", "Retrying failed network requests", "Graceful shutdown / resource cleanup"],
        ["Why should you avoid a bare except: clause?", "When does the finally block run relative to except?"],
        "Write a divide(a, b) function that handles ZeroDivisionError and TypeError with distinct, helpful messages.",
    ),
    T(
        "oop", "Object-Oriented Programming", "Intermediate",
        ["Classes & Objects", "Constructors", "Inheritance", "Polymorphism", "Encapsulation", "Magic Methods"],
        "Classes, inheritance, and Python's approach to OOP.",
        "Object-oriented programming organizes code around classes (blueprints) and objects (instances). "
        "__init__ sets up an object's initial state, inheritance lets one class reuse and extend another's "
        "behavior, polymorphism lets different classes share a common interface, encapsulation hides internal "
        "details, and magic methods (like __str__) customize how built-ins behave on your objects.",
        "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f'{self.name} makes a sound'\n\nclass Dog(Animal):\n    def speak(self):\n        return f'{self.name} barks'\n\nfor a in [Animal('Generic'), Dog('Rex')]:\n    print(a.speak())",
        ["Override a method in a subclass to see polymorphism in action"],
        ["Modeling real-world entities in an app", "Building reusable class hierarchies", "Implementing plugin/strategy patterns"],
        ["What's the difference between overriding and overloading in Python?", "What does encapsulation mean in Python, given it has no true private fields?"],
        "Create a Shape base class with an area() method, then Circle and Rectangle subclasses that override it, and print each area from a list.",
    ),
    T(
        "modules-packages", "Modules & Packages", "Intermediate",
        ["import", "Built-in Modules", "Custom Modules", "pip & Packages"],
        "Organizing code into modules and installing third-party packages.",
        "A module is a .py file you import with import module_name; a package is a folder of modules with an "
        "__init__.py. Python ships with built-in modules (math, random, os), and third-party packages install "
        "via pip install package_name from the Python Package Index.",
        "import math\nimport random\n\nprint(math.sqrt(49))\nprint(random.choice(['heads', 'tails']))",
        ["Use two built-in modules together"],
        ["Splitting a large app into maintainable files", "Reusing utility functions across projects", "Installing and using third-party libraries"],
        ["What's the difference between a module and a package?", "What does pip do, and where does it install packages from?"],
        "Create your own mathutils.py with an is_prime(n) function, then import and use it from a separate script.",
    ),
    T(
        "advanced-python", "Advanced Python", "Advanced",
        ["Decorators", "Generators", "Iterators", "Closures", "Context Managers", "Async/Await"],
        "Decorators, generators, closures, and async programming.",
        "Decorators wrap a function to add behavior without changing its code, generators (yield) produce "
        "values lazily instead of building a whole list in memory, closures capture variables from an "
        "enclosing scope, context managers (with) automate setup/teardown, and asyncio enables concurrent "
        "I/O-bound code without threads.",
        "def timer(func):\n    def wrapper(*args, **kwargs):\n        print(f'Calling {func.__name__}')\n        return func(*args, **kwargs)\n    return wrapper\n\n@timer\ndef greet(name):\n    return f'Hello, {name}'\n\ndef count_up_to(n):\n    i = 1\n    while i <= n:\n        yield i\n        i += 1\n\nprint(greet('EduMind'))\nprint(list(count_up_to(4)))",
        ["Write a decorator and a generator function"],
        ["Logging/timing function calls with decorators", "Streaming large datasets with generators", "Handling many concurrent I/O requests with asyncio"],
        ["What's the difference between a generator and a normal function?", "How does asyncio differ from multithreading for concurrency?"],
        "Write an @log_time decorator that prints how long a function took, using the time module, and apply it to a function that sums a large range.",
    ),
    T(
        "popular-libraries", "Popular Libraries", "Advanced",
        ["NumPy", "Pandas", "Matplotlib", "Scikit-learn", "Flask", "Django"],
        "The essential Python libraries for data and web work.",
        "NumPy provides fast array math, Pandas handles tabular data with DataFrames, Matplotlib and Seaborn "
        "create charts, Scikit-learn implements machine learning algorithms, and Flask/Django build web "
        "applications — each installed via pip and imported as needed.",
        "import numpy as np\nimport pandas as pd\n\narr = np.array([1, 2, 3, 4])\nprint(arr.mean())\n\ndf = pd.DataFrame({'name': ['Alice', 'Bob'], 'score': [92, 85]})\nprint(df[df['score'] > 90])",
        ["Compute a mean with NumPy and filter a DataFrame with Pandas"],
        ["Data cleaning and analysis pipelines", "Building REST APIs with Flask/Django", "Training and evaluating ML models"],
        ["Why is NumPy faster than plain Python lists for numeric work?", "When would you choose Flask over Django?"],
        "Load a small CSV of sales data into a Pandas DataFrame and use .groupby() to find total sales per region.",
    ),
    T(
        "database", "Working with Databases", "Advanced",
        ["SQLite", "MySQL", "PostgreSQL", "MongoDB (PyMongo)"],
        "Connecting Python to SQL and NoSQL databases.",
        "Python connects to databases through driver libraries: sqlite3 is built in for lightweight local "
        "databases, mysql-connector-python or PyMySQL for MySQL, psycopg2 for PostgreSQL, and pymongo for "
        "MongoDB. Most follow the same pattern: connect, get a cursor, execute a query, then fetch or commit.",
        "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE students (name TEXT, score INTEGER)')\ncur.execute(\"INSERT INTO students VALUES ('Alice', 92)\")\nconn.commit()\ncur.execute('SELECT * FROM students')\nprint(cur.fetchall())",
        ["Create a table, insert a row, and query it back"],
        ["Backend persistence layers", "Data pipelines and ETL scripts", "Local caching with SQLite"],
        ["Why must you call conn.commit() after an INSERT?", "How do parameterized queries help prevent SQL injection?"],
        "Create a SQLite books table, insert three rows, and query for books published after 2015.",
    ),
    T(
        "testing", "Testing in Python", "Advanced",
        ["unittest", "pytest", "Mocking"],
        "Writing automated tests with unittest and pytest.",
        "unittest is Python's built-in testing framework using TestCase classes, while pytest is a popular "
        "alternative with a simpler function-based style. Mocking (via unittest.mock) replaces real "
        "dependencies, like an API call, with fake ones so tests run fast and predictably.",
        "def add(a, b):\n    return a + b\n\n# test_add.py (pytest style)\ndef test_add_positive():\n    assert add(2, 3) == 5\n\ndef test_add_negative():\n    assert add(-1, -1) == -2",
        ["Write two simple pytest test functions"],
        ["CI/CD pipelines that gate merges on passing tests", "Regression-testing bug fixes", "Mocking external APIs in test suites"],
        ["What's the benefit of mocking an external API in a test?", "How does pytest discover which functions are tests?"],
        "Write three pytest tests for is_palindrome(s): a normal case, an empty string, and mixed capitalization.",
    ),
    T(
        "projects", "Python Projects", "Advanced",
        ["Beginner Projects", "Intermediate Projects", "Advanced Projects"],
        "Applying Python skills to real, complete projects.",
        "Applying concepts to real projects is how they stick — beginner projects (a calculator, a guessing "
        "game) build fluency with syntax and control flow, intermediate projects (a to-do list with file "
        "storage) add data structures and persistence, and advanced projects combine multiple libraries.",
        "import random\n\nsecret = random.randint(1, 20)\nguess = int(input('Guess a number (1-20): '))\nif guess == secret:\n    print('Correct!')\nelif guess < secret:\n    print('Too low')\nelse:\n    print('Too high')",
        ["Build a simple number-guessing CLI game"],
        ["Portfolio pieces for job applications", "Learning a new library hands-on", "Automating a personal task"],
        ["How would you structure a growing project into multiple files?", "What's your process for scoping a project before writing code?"],
        "Build a command-line to-do app that adds, lists, and completes tasks, saving them to a JSON file between runs.",
    ),
    T(
        "interview", "Python Interview Prep", "Advanced",
        ["MCQs", "Coding Questions", "Complexity Analysis"],
        "Common Python interview question patterns.",
        "Python interview prep spans multiple-choice fundamentals (data types, mutability, scope), coding "
        "questions solved under time pressure, and company-style questions that weigh both correctness and "
        "how clearly you reason about time and space complexity.",
        "def has_duplicate(nums):\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False\n\nprint(has_duplicate([1, 2, 3, 2]))",
        ["Detect a duplicate in a list using a set"],
        ["Technical screening interviews", "Take-home coding assessments", "Whiteboard problem-solving rounds"],
        ["What's the time complexity of checking membership in a set vs a list?", "How would you find the first non-repeating character in a string?"],
        "Solve 'find the first non-repeating character in a string' and state the time complexity of your solution.",
    ),
    T(
        "cheatsheets", "Python Cheat Sheet", "Advanced",
        ["Syntax Reference", "Built-in Functions", "String/List Methods"],
        "A quick-reference summary of commonly used syntax.",
        "A good cheat sheet condenses syntax you want to recall quickly — string/list/dict methods, common "
        "built-ins, and formatting patterns — so you're not searching documentation mid-project.",
        "len(x)          # length of a string/list/dict\nsorted(x)       # new sorted list\nenumerate(x)    # (index, value) pairs while looping\nzip(a, b)       # pair up two iterables element-wise\nf'{x:.2f}'      # format a float to 2 decimal places",
        ["A quick reference block of common built-ins"],
        ["Quick lookup while coding", "Onboarding new team members", "Interview last-minute review"],
        ["What does enumerate() return, and why is it useful in loops?", "What's the difference between zip() and just indexing two lists together?"],
        "Build your own one-page cheat sheet of the 15 built-ins and string methods you use most, and keep updating it as you learn.",
    ),
]

# ---------------------------------------------------------------------------
# HTML — 5 topics
# ---------------------------------------------------------------------------
HTML_TOPICS = [
    T(
        "intro", "HTML Introduction", "Beginner",
        ["Document Structure", "Elements", "Attributes", "DOCTYPE"],
        "The structure of an HTML document and how elements and attributes work.",
        "HTML structures web content using nested elements made of opening and closing tags. Every document "
        "has a root <html> element containing a <head> (metadata, not shown to visitors) and a <body> (the "
        "visible content), and elements can carry attributes like id, class, or src.",
        "<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1 id=\"welcome\">Hello, EduMind!</h1>\n  </body>\n</html>",
        ["A minimal valid HTML document with a title and heading"],
        ["Building the skeleton of any web page", "SEO-friendly page titles/metadata", "Structuring content for accessibility tools"],
        ["What's the purpose of the <!DOCTYPE html> declaration?", "What's the difference between the <head> and <body>?"],
        "Build a minimal HTML page with a title, one heading, and one paragraph, then inspect it with browser dev tools.",
    ),
    T(
        "text", "Text & Lists", "Beginner",
        ["Headings", "Paragraphs", "Ordered/Unordered Lists"],
        "Structuring text content with headings, paragraphs, and lists.",
        "Headings (<h1>-<h6>) establish a page's content hierarchy — they matter for accessibility and SEO, "
        "not just font size. Paragraphs (<p>) hold body text, and lists come as <ul> (bulleted) or <ol> "
        "(numbered), each containing <li> items.",
        "<h1>Learning HTML</h1>\n<p>HTML is the backbone of every web page.</p>\n<ul>\n  <li>Structure</li>\n  <li>Content</li>\n</ul>",
        ["A heading, paragraph, and bulleted list together"],
        ["Blog and article layouts", "Documentation pages", "Navigation menus built from lists"],
        ["Why should you avoid skipping heading levels?", "When would you use <ol> instead of <ul>?"],
        "Build a recipe page with an h1 title, an h2 'Ingredients' section using a ul, and an h2 'Steps' section using an ol.",
    ),
    T(
        "links", "Links & Images", "Beginner",
        ["Anchor Tags", "Images", "Alt Text", "Accessibility"],
        "Linking pages together and embedding images accessibly.",
        "The <a> tag creates hyperlinks using href, and <img> embeds images using src plus a required alt "
        "attribute describing the image for screen readers and for when it fails to load.",
        "<a href=\"https://edumind.example.com\" target=\"_blank\" rel=\"noopener\">Visit EduMind</a>\n<img src=\"python-logo.png\" alt=\"Python programming language logo\">",
        ["A link that opens in a new tab, and an accessible image"],
        ["Navigation between pages", "Embedding product/profile images", "SEO through descriptive alt text"],
        ["Why is the alt attribute important on images?", "Why pair target=\"_blank\" with rel=\"noopener\"?"],
        "Build an 'about me' section with a profile image (meaningful alt text) and links to two of your favorite sites.",
    ),
    T(
        "forms", "Forms", "Intermediate",
        ["Input Types", "Labels", "Validation", "Form Layout"],
        "Collecting user input with built-in browser validation.",
        "The <form> element collects input through fields like <input type=\"email\">, and browsers can "
        "validate them natively using attributes like required and pattern. Pairing each field with a <label> "
        "improves usability and accessibility.",
        "<form>\n  <label for=\"email\">Email</label>\n  <input type=\"email\" id=\"email\" required>\n  <button type=\"submit\">Subscribe</button>\n</form>",
        ["A labeled, natively-validated email input"],
        ["Signup and login forms", "Contact and feedback forms", "Checkout/payment forms"],
        ["How does the required attribute affect form submission?", "Why must a label's for attribute match the input's id?"],
        "Build a contact form with name, email, and message fields using required and appropriate input types.",
    ),
    T(
        "semantics", "Semantic HTML", "Intermediate",
        ["header/nav/main/footer", "section & article", "ARIA basics"],
        "Writing meaningful markup for accessibility and SEO.",
        "Semantic elements like <header>, <nav>, <main>, and <footer> describe the meaning of content rather "
        "than just its appearance, helping browsers, search engines, and assistive technology understand page "
        "structure. ARIA attributes fill gaps when semantic HTML alone isn't enough.",
        "<header><h1>EduMind</h1></header>\n<nav aria-label=\"Main navigation\">\n  <a href=\"/skills\">Skills</a>\n</nav>\n<main>\n  <section>\n    <h2>Featured Course</h2>\n  </section>\n</main>\n<footer>\u00a9 2026 EduMind</footer>",
        ["A page skeleton using semantic landmark elements"],
        ["Screen-reader-friendly page navigation", "SEO structure for search engines", "Consistent site-wide layouts"],
        ["Why do semantic tags matter for accessibility?", "When would you use ARIA attributes on top of semantic HTML?"],
        "Refactor a page built entirely with divs into one using header, nav, main, section, and footer.",
    ),
]

# ---------------------------------------------------------------------------
# CSS — 5 topics
# ---------------------------------------------------------------------------
CSS_TOPICS = [
    T(
        "selectors", "Selectors", "Beginner",
        ["Type Selectors", "Class Selectors", "ID Selectors", "Attribute Selectors", "Specificity"],
        "Targeting elements and understanding which rule wins.",
        "CSS selectors target which HTML elements a rule applies to: type selectors match tag names, class "
        "selectors match a reusable .class-name, ID selectors match a unique #id, and attribute selectors "
        "match elements with a given attribute. Specificity determines which rule wins when several match.",
        "p { color: gray; }\n.highlight { color: orange; font-weight: bold; }\n#main-title { font-size: 2rem; }",
        ["Style paragraphs, a reusable class, and one unique ID"],
        ["Reusable component styling with classes", "One-off unique element styling with IDs", "Theming based on data attributes"],
        ["Which is more specific: a class or an ID selector?", "How would you target only h2 elements inside .card?"],
        "Style three product cards using a shared .card class plus a unique #featured id for one that should stand out.",
    ),
    T(
        "box", "The Box Model", "Beginner",
        ["Content, Padding, Border, Margin", "box-sizing"],
        "How every element's size is calculated.",
        "Every element is a rectangular box made of content, padding, border, and margin. By default "
        "width/height apply only to the content area, but box-sizing: border-box includes padding and border "
        "too, which is usually what you actually want.",
        ".card {\n  width: 200px;\n  padding: 16px;\n  border: 2px solid #333;\n  margin: 12px;\n  box-sizing: border-box;\n}",
        ["A card exactly 200px wide including padding and border"],
        ["Consistent component sizing", "Card and button layouts", "Predictable spacing systems"],
        ["What's the difference between content-box and border-box?", "Why can adjacent vertical margins 'collapse'?"],
        "Build two 200px-wide boxes with the same padding — one content-box, one border-box — and compare their rendered sizes.",
    ),
    T(
        "layout", "Flexbox & Grid", "Intermediate",
        ["Flexbox", "CSS Grid", "Positioning"],
        "Modern layout systems for one and two dimensions.",
        "Flexbox lays out items in a single row or column and excels at aligning/distributing space, while CSS "
        "Grid lays out items in two dimensions at once. Positioning (relative, absolute, fixed, sticky) "
        "adjusts elements within or removes them from normal flow.",
        ".nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}",
        ["A flex navbar and a 3-column grid"],
        ["Navigation bars and toolbars (Flexbox)", "Photo galleries and dashboards (Grid)", "Sticky headers (position: sticky)"],
        ["When would you choose Grid over Flexbox?", "How does position: sticky differ from position: fixed?"],
        "Rebuild a 3-column pricing table twice — once with Flexbox, once with Grid — and compare which felt more natural.",
    ),
    T(
        "responsive", "Responsive Design", "Intermediate",
        ["Media Queries", "Mobile-First", "Viewport"],
        "Adapting layouts across screen sizes.",
        "Responsive design adapts layout to different screen sizes using media queries to apply different "
        "styles at breakpoints, combined with a mobile-first approach where base styles target small screens "
        "and complexity is added for larger ones.",
        ".container {\n  display: flex;\n  flex-direction: column;\n}\n@media (min-width: 768px) {\n  .container {\n    flex-direction: row;\n  }\n}",
        ["A layout that stacks on mobile and rows on desktop"],
        ["Mobile-friendly e-commerce sites", "Dashboards that adapt to tablet/desktop", "Newsletter/email templates"],
        ["What does 'mobile-first' mean in responsive design?", "Why is the viewport meta tag necessary for responsive pages?"],
        "Take a 3-column layout and make it collapse to a single column below 600px using a media query.",
    ),
    T(
        "animations", "Transitions & Animations", "Advanced",
        ["transition", "@keyframes", "transform"],
        "Adding motion with transitions and keyframe animations.",
        "CSS transitions animate a property smoothly between two states (like a hover color change), while "
        "@keyframes define multiple animation steps that can loop, applied with the animation property.",
        ".btn {\n  background: #3b82f6;\n  transition: background 0.3s ease;\n}\n.btn:hover { background: #2563eb; }\n\n@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n}\n.badge { animation: pulse 1.5s infinite; }",
        ["A hover transition and a looping pulse animation"],
        ["Hover/focus micro-interactions", "Loading spinners and skeleton screens", "Entrance animations for cards/modals"],
        ["What's the difference between transition and @keyframes animation?", "Why prefer animating transform/opacity over width/height?"],
        "Add a fade-in-and-slide-up entrance animation to a card using @keyframes, triggered automatically on page load.",
    ),
]

# ---------------------------------------------------------------------------
# SQL — 5 topics
# ---------------------------------------------------------------------------
SQL_TOPICS = [
    T(
        "intro", "SQL & Databases Introduction", "Beginner",
        ["What is SQL?", "Relational Databases", "CREATE TABLE", "INSERT"],
        "What relational databases are and how to create your first table.",
        "SQL is how you communicate with relational databases — structured, table-based systems where data is "
        "organized into rows and columns. Databases store data persistently, enforce structure and rules like "
        "uniqueness, and let many users query and update the same data reliably at once.",
        "CREATE TABLE students (\n  id INT PRIMARY KEY,\n  name TEXT,\n  score INT\n);\nINSERT INTO students VALUES (1, 'Alice', 92);\nSELECT * FROM students;",
        ["Create a table and insert one row"],
        ["Storing structured application data", "Powering admin dashboards/reports", "Backing e-commerce and CMS platforms"],
        ["What does a PRIMARY KEY guarantee?", "What's the difference between a relational database and a plain file?"],
        "Create a table for a small library (id, title, author, year) and insert three rows.",
    ),
    T(
        "select", "SELECT, WHERE & ORDER BY", "Beginner",
        ["SELECT", "WHERE", "ORDER BY", "LIMIT"],
        "Filtering, sorting, and limiting query results.",
        "SELECT retrieves data, WHERE filters which rows come back, and ORDER BY controls the result order. "
        "Combining these is the most common query pattern you'll write.",
        "SELECT name, score\nFROM students\nWHERE score >= 80\nORDER BY score DESC\nLIMIT 5;",
        ["Filter, sort, and limit query results together"],
        ["Search and filter features", "Leaderboards and rankings", "Paginated result lists"],
        ["What's the difference between WHERE and ORDER BY?", "How would you paginate results using LIMIT?"],
        "Write a query that returns the names of all books published after 2015, sorted alphabetically by title.",
    ),
    T(
        "joins", "Joins & Grouping", "Intermediate",
        ["INNER JOIN", "LEFT JOIN", "GROUP BY", "Aggregate Functions"],
        "Combining and summarizing data across tables.",
        "Joins combine rows from two or more tables based on a related column. INNER JOIN returns only "
        "matching rows, LEFT JOIN keeps all rows from the left table, and GROUP BY aggregates rows sharing a "
        "value, usually paired with COUNT()/SUM().",
        "SELECT students.name, courses.title\nFROM students\nJOIN enrollments ON students.id = enrollments.student_id\nJOIN courses ON enrollments.course_id = courses.id;\n\nSELECT course_id, COUNT(*) AS enrolled\nFROM enrollments\nGROUP BY course_id;",
        ["Join three tables, then group and count enrollments"],
        ["Reporting dashboards (sales by region)", "Many-to-many relationships (students/courses)", "Analytics summaries"],
        ["What's the difference between INNER JOIN and LEFT JOIN?", "Why must non-aggregated SELECT columns appear in GROUP BY?"],
        "Given students, courses, and enrollments tables, write a query showing each course's title alongside how many students are enrolled.",
    ),
    T(
        "schema", "Schema Design", "Intermediate",
        ["Primary/Foreign Keys", "Constraints", "Indexes"],
        "Designing related tables with keys, constraints, and indexes.",
        "Schema design is deciding what tables, columns, and relationships you need. A PRIMARY KEY uniquely "
        "identifies each row, FOREIGN KEYs link tables and enforce referential integrity, and indexes speed up "
        "lookups on frequently filtered/joined columns.",
        "CREATE TABLE authors (\n  id INT PRIMARY KEY,\n  name TEXT NOT NULL\n);\nCREATE TABLE books (\n  id INT PRIMARY KEY,\n  title TEXT NOT NULL,\n  author_id INT,\n  FOREIGN KEY (author_id) REFERENCES authors(id)\n);\nCREATE INDEX idx_books_title ON books(title);",
        ["Two related tables with a foreign key and an index"],
        ["Multi-table application backends", "Enforcing data integrity at the DB level", "Speeding up common searches with indexes"],
        ["What does a foreign key constraint prevent?", "What's the tradeoff of adding more indexes to a table?"],
        "Design a schema for a simple blog: authors, posts, and comments, with appropriate foreign keys connecting them.",
    ),
    T(
        "functions", "Aggregate & Date Functions", "Advanced",
        ["COUNT/SUM/AVG", "MIN/MAX", "Date Functions"],
        "Summarizing and working with dates in SQL.",
        "Aggregate functions (COUNT, SUM, AVG, MIN, MAX) compute a single value across a group of rows, "
        "typically paired with GROUP BY. Date functions let you work with dates and times directly in SQL.",
        "SELECT AVG(score) AS avg_score, MAX(score) AS top_score\nFROM students;\n\nSELECT name, DATEDIFF(NOW(), enrolled_on) AS days_enrolled\nFROM students;",
        ["Compute an average/max and a date difference"],
        ["Dashboard summary statistics", "Subscription/trial expiration logic", "Cohort and retention analysis"],
        ["Do aggregate functions like AVG count NULL values?", "What's the difference between COUNT(*) and COUNT(column)?"],
        "Write a query returning the average score per class using GROUP BY, and another finding students enrolled more than 30 days ago.",
    ),
]

# ---------------------------------------------------------------------------
# JAVASCRIPT — 21 topics
# ---------------------------------------------------------------------------
JAVASCRIPT_TOPICS = [
    T(
        "js-intro", "JavaScript Introduction", "Beginner",
        ["What is JavaScript?", "Features", "History", "How JS Runs", "First Program"],
        "What JavaScript is and where it runs.",
        "JavaScript is a dynamically-typed, interpreted scripting language that runs natively in every web "
        "browser, powering interactivity on the web. It has since expanded beyond the browser via Node.js, and "
        "evolves through yearly ECMAScript (ES) specification updates.",
        "console.log('Hello, EduMind!');\nconsole.log(2 + 3);",
        ["Log a greeting and a sum to the console"],
        ["Interactive web pages", "Server-side apps via Node.js", "Browser extensions and automation scripts"],
        ["What is ECMAScript, and how does it relate to JavaScript?", "Where can JavaScript run besides the browser?"],
        "Open your browser's dev tools console and log your name plus the current year using new Date().getFullYear().",
    ),
    T(
        "js-basics", "Variables & Data Types", "Beginner",
        ["let/const/var", "Data Types", "Type Coercion", "Strict Equality"],
        "Declaring variables and understanding JavaScript's type system.",
        "let and const replaced var for declaring variables — let allows reassignment, const doesn't, and both "
        "are block-scoped unlike var. JavaScript has dynamic typing with coercion rules that can be "
        "surprising, which is why strict equality (===) is recommended over ==.",
        "let count = 0;\nconst name = 'EduMind';\ncount = count + 1;\nconsole.log(`${name}: ${count}`);\nconsole.log('5' === 5, '5' == 5);",
        ["Compare strict vs loose equality with mismatched types"],
        ["Safe numeric comparisons in forms", "Immutable configuration values (const)", "Avoiding var-related scoping bugs"],
        ["Why is === generally preferred over == in JavaScript?", "What's the difference in scoping between var and let?"],
        "Declare a const array of three numbers and log their sum using a loop.",
    ),
    T(
        "js-control-flow", "Control Flow", "Beginner",
        ["if/else", "switch", "Ternary", "Truthy/Falsy"],
        "Branching logic and JavaScript's truthy/falsy rules.",
        "Control flow branches based on a condition — if/else if/else, switch for comparing one value against "
        "many cases, and the ternary operator for compact choices. JavaScript treats 0, '', null, undefined, "
        "NaN, and false as 'falsy'; everything else is 'truthy'.",
        "const hour = 14;\nlet greeting;\nif (hour < 12) greeting = 'Good morning';\nelse if (hour < 18) greeting = 'Good afternoon';\nelse greeting = 'Good evening';\nconsole.log(greeting);",
        ["Pick a greeting based on the current hour"],
        ["Time-of-day/personalized UI logic", "Multi-branch menu handling with switch", "Conditional rendering shortcuts"],
        ["What values are 'falsy' in JavaScript?", "How does switch's equality comparison work?"],
        "Write a function that returns a season name from a month number using a switch statement.",
    ),
    T(
        "js-loops", "Loops", "Beginner",
        ["for", "while", "do-while", "for-of", "for-in"],
        "Repeating code with different loop types.",
        "for loops repeat a known number of times, while checks a condition before each iteration, and "
        "do-while checks after. for-of iterates over values (arrays, strings); for-in iterates over an "
        "object's keys.",
        "const fruits = ['apple', 'banana', 'cherry'];\nfor (const fruit of fruits) {\n  if (fruit === 'banana') continue;\n  console.log(fruit);\n}",
        ["Loop over an array, skipping one value with continue"],
        ["Rendering lists of items", "Processing API response arrays", "Retry loops for network calls"],
        ["What's the difference between for-of and for-in?", "When does a do-while loop's body run at least once?"],
        "Use for-of to loop over an array of student objects, printing each name and score but skipping any student who failed.",
    ),
    T(
        "js-functions", "Functions & Closures", "Beginner",
        ["Declarations", "Arrow Functions", "Default/Rest Params", "Closures", "Recursion"],
        "Defining functions and understanding closures.",
        "Functions can be declared, assigned as expressions, or written as arrow functions, which don't have "
        "their own this. Closures let an inner function 'remember' variables from its enclosing scope even "
        "after that scope finishes running.",
        "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst counter = makeCounter();\nconsole.log(counter(), counter(), counter());",
        ["Build a counter using a closure"],
        ["Private state in modules (closures)", "Event handler callbacks", "Debounce/throttle utilities"],
        ["What is a closure, in your own words?", "Why do arrow functions not have their own `this`?"],
        "Write a debounce(fn, delay) function that returns a new function which only calls fn after delay ms have passed without another call.",
    ),
    T(
        "js-strings", "Strings & Template Literals", "Beginner",
        ["Template Literals", "String Methods", "Regex Basics"],
        "Formatting and manipulating text.",
        "Template literals (backtick strings) support multi-line text and ${expression} interpolation "
        "directly. Common methods include .includes(), .replace(), .split(), and RegExp enables pattern "
        "matching.",
        "const name = 'EduMind';\nconst msg = `Welcome to ${name}!`;\nconsole.log(msg);\nconsole.log('a,b,c'.split(',').join(' | '));",
        ["Build an interpolated string and re-join a split array"],
        ["Dynamic UI text and templating", "Parsing/validating user input with regex", "Building CSV-like formatted output"],
        ["What are the advantages of template literals over string concatenation?", "How does .split()/.join() work together?"],
        "Write a function that takes a comma-separated string of names and joins them with 'and' before the last one.",
    ),
    T(
        "js-arrays", "Arrays & Array Methods", "Intermediate",
        ["map/filter/reduce", "find/some/every", "Destructuring", "Spread"],
        "Functional array methods for transforming data.",
        "Arrays support powerful functional methods: .map() transforms each element, .filter() keeps only "
        "elements passing a test, .reduce() folds the array into a single value. Destructuring and spread "
        "make working with arrays more concise.",
        "const nums = [4, 1, 7, 3];\nconst doubled = nums.map(n => n * 2);\nconst total = nums.reduce((sum, n) => sum + n, 0);\nconsole.log(doubled, total);",
        ["Transform and total an array with map/reduce"],
        ["Transforming API data for display", "Computing totals/statistics", "Filtering search/list results"],
        ["What's the difference between map() and forEach()?", "How does reduce()'s initial value affect the result?"],
        "Given an array of order totals, use reduce to compute both the sum and the count of orders over $100 in a single pass.",
    ),
    T(
        "js-objects", "Objects", "Intermediate",
        ["Object Literals", "Destructuring", "Object.keys/values/entries", "JSON"],
        "Storing and working with structured data.",
        "Objects store key-value pairs and can hold methods. Object.entries() extracts key-value pairs as an "
        "array for iteration, destructuring pulls specific properties into variables, and JSON.stringify()/"
        "parse() convert between objects and JSON text.",
        "const student = { name: 'Alice', score: 92 };\nconst { name, score } = student;\nconsole.log(JSON.stringify({ name, score }));",
        ["Destructure an object and serialize it to JSON"],
        ["Modeling API request/response payloads", "Configuration objects", "State shape in UI components"],
        ["What does JSON.stringify() do with functions and undefined values?", "How does destructuring simplify pulling data out of objects?"],
        "Write a function that takes an object and returns a new object with all its numeric values doubled, using Object.entries and destructuring.",
    ),
    T(
        "js-dom", "The DOM", "Intermediate",
        ["querySelector", "Changing Content", "Creating Elements", "Styling"],
        "Reading and modifying the page with JavaScript.",
        "The DOM is the browser's live, tree-structured representation of an HTML page. querySelector() "
        "selects elements, .textContent changes content, and createElement()/appendChild() add elements "
        "dynamically.",
        "const heading = document.querySelector('h1');\nheading.textContent = 'Updated by JS';\nconst item = document.createElement('li');\nitem.textContent = 'New skill';\ndocument.querySelector('ul').appendChild(item);",
        ["Update text and add a new list item dynamically"],
        ["Dynamic content updates without a page reload", "Building UI components from scratch", "Form field manipulation"],
        ["What's the difference between innerHTML and textContent?", "Why should you check an element isn't null before using it?"],
        "Build a button that, when clicked, adds a new list item containing the current time to a ul on the page.",
    ),
    T(
        "js-events", "Events", "Intermediate",
        ["addEventListener", "Bubbling", "Delegation", "preventDefault"],
        "Responding to user interaction.",
        "addEventListener() attaches a handler to an event on an element. Events bubble up through ancestors "
        "by default, and event delegation exploits this by attaching one listener to a parent instead of many "
        "children. preventDefault() stops default browser behavior.",
        "document.querySelector('form').addEventListener('submit', (e) => {\n  e.preventDefault();\n  console.log('Form intercepted');\n});",
        ["Intercept a form submission before it reloads the page"],
        ["Form validation before submission", "Click handling for dynamic lists (delegation)", "Custom keyboard shortcuts"],
        ["What is event delegation, and why is it useful?", "What does e.preventDefault() actually prevent?"],
        "Build a to-do list where clicking any list item toggles a 'completed' class, using one delegated event listener.",
    ),
    T(
        "js-es6", "ES6+ Features", "Intermediate",
        ["Destructuring", "Spread/Rest", "Classes", "Optional Chaining"],
        "Modern JavaScript syntax introduced from ES6 onward.",
        "ES6 and later introduced most of modern JavaScript's ergonomics: destructuring, spread/rest, native "
        "classes, Promises, ES modules, and optional chaining (?.) for safely accessing possibly-missing "
        "nested properties.",
        "const user = { profile: { name: 'Alice' } };\nconsole.log(user.profile?.name);\nconsole.log(user.address?.city ?? 'No address on file');",
        ["Safely read a possibly-missing nested property"],
        ["Safely handling incomplete API responses", "Avoiding defensive if-checks for nested data", "Cleaner class-based components"],
        ["What's the difference between ?. and ??", "How are JavaScript classes related to prototypes under the hood?"],
        "Refactor an object with deeply nested, possibly-missing properties to safely read a value using ?. and ??.",
    ),
    T(
        "js-async", "Asynchronous JavaScript", "Advanced",
        ["Promises", "async/await", "fetch", "Error Handling"],
        "Handling operations that take time without blocking.",
        "Promises represent a value that will resolve or reject in the future, and async/await lets you write "
        "Promise-based code that reads like synchronous code, with try/catch for error handling.",
        "async function getUser() {\n  try {\n    const res = await fetch('https://api.example.com/user/1');\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    console.log(await res.json());\n  } catch (err) {\n    console.error('Failed:', err.message);\n  }\n}",
        ["Fetch data with proper error handling"],
        ["Loading data from a REST API", "Sequencing multiple dependent network calls", "Handling timeouts/retries gracefully"],
        ["Why doesn't fetch() reject on a 404 response?", "What's the difference between a Promise and async/await syntactically?"],
        "Write an async function that fetches posts from https://jsonplaceholder.typicode.com/posts and logs just the first three titles.",
    ),
    T(
        "js-browser-apis", "Browser APIs", "Advanced",
        ["localStorage", "sessionStorage", "Cookies", "Clipboard"],
        "Using browser features beyond the page itself.",
        "localStorage persists key-value string data across sessions until cleared, sessionStorage clears "
        "when the tab closes, and cookies are sent with every HTTP request. Permission-gated APIs (clipboard, "
        "geolocation) return Promises.",
        "localStorage.setItem('theme', 'dark');\nconsole.log(localStorage.getItem('theme'));",
        ["Persist and read back a user preference"],
        ["Remembering user preferences (theme, language)", "Client-side caching of API responses", "Copy-to-clipboard UI features"],
        ["What's the difference between localStorage and sessionStorage?", "Why must objects be JSON.stringify'd before storing in localStorage?"],
        "Build a settings panel that saves a chosen theme to localStorage and reapplies it on page reload.",
    ),
    T(
        "js-modules", "Modules", "Advanced",
        ["import/export", "Default vs Named Exports", "Bundlers"],
        "Splitting code across files with ES modules.",
        "ES modules split code across files using export and import. A file can have one default export and "
        "many named exports, and bundlers like Vite combine modules into optimized files for the browser.",
        "// mathUtils.js\nexport const square = x => x * x;\nexport default function cube(x) { return x ** 3; }\n\n// main.js\nimport cube, { square } from './mathUtils.js';",
        ["Export and import both a default and a named function"],
        ["Organizing large codebases into files", "Sharing utility functions across a project", "Tree-shaking unused code out of bundles"],
        ["What's the difference between a default export and a named export?", "Why do browsers need type=\"module\" to use import/export natively?"],
        "Split a calculator's add/subtract/multiply/divide functions into a separate module file and import them into a main script.",
    ),
    T(
        "js-oop", "Object-Oriented JavaScript", "Advanced",
        ["Classes", "Inheritance", "Prototypes"],
        "Classes, inheritance, and JavaScript's prototype system.",
        "JavaScript classes are syntax over its underlying prototype system — every object has a hidden link "
        "to a prototype it inherits methods from. extends and super() implement inheritance.",
        "class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return `${this.name} makes a sound`; }\n}\nclass Dog extends Animal {\n  speak() { return `${this.name} barks`; }\n}",
        ["Override a parent class method in a subclass"],
        ["Modeling UI components as classes", "Game entity hierarchies", "Reusable base classes for shared behavior"],
        ["What must be called before using `this` in a subclass constructor?", "What is the prototype chain, conceptually?"],
        "Create a Shape base class with an area() method and Circle/Rectangle subclasses that override it, then print each area from a list of instances.",
    ),
    T(
        "js-error-handling", "Error Handling", "Advanced",
        ["try/catch/finally", "throw", "Custom Errors"],
        "Catching and raising errors gracefully.",
        "try/catch catches runtime errors so they don't crash the program, finally runs regardless, and throw "
        "lets you raise custom errors extending the built-in Error class.",
        "class ValidationError extends Error {\n  constructor(message) { super(message); this.name = 'ValidationError'; }\n}\nfunction checkAge(age) {\n  if (age < 0) throw new ValidationError(\"Age can't be negative\");\n  return age;\n}",
        ["Define and throw a custom error class"],
        ["Input validation with clear error messages", "Centralized API error handling", "Graceful degradation on failures"],
        ["Why should custom errors extend the built-in Error class?", "When does the finally block execute?"],
        "Write a parseJSON(str) function that wraps JSON.parse in try/catch and throws a custom InvalidJSONError with a helpful message on failure.",
    ),
    T(
        "js-advanced", "Advanced Concepts", "Advanced",
        ["Hoisting", "Event Loop", "Debouncing", "Throttling"],
        "How JavaScript actually executes code under the hood.",
        "Hoisting moves declarations to the top of their scope before code runs, and the event loop lets "
        "JavaScript handle async callbacks without blocking, by processing them once the call stack is empty.",
        "console.log(typeof hoisted);\nvar hoisted = \"I'm hoisted\";",
        ["Demonstrate hoisting with a var declaration"],
        ["Debugging unexpected undefined values (hoisting)", "Optimizing scroll/resize handlers (throttling)", "Reducing redundant API calls (debouncing)"],
        ["Why does the event loop wait for the call stack to be empty?", "What's the practical difference between debouncing and throttling?"],
        "Implement a throttle(fn, interval) function and test it against rapid scroll or mousemove events, logging at most once per interval.",
    ),
    T(
        "js-api-integration", "API Integration", "Advanced",
        ["REST Basics", "fetch/axios", "Authentication", "JWT"],
        "Talking to backend APIs from the browser.",
        "REST APIs expose resources over HTTP using GET/POST/PUT/DELETE. Authenticated APIs typically require "
        "a token, often a JWT, sent in the Authorization header.",
        "async function createPost(title) {\n  const res = await fetch('/posts', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },\n    body: JSON.stringify({ title })\n  });\n  return res.json();\n}",
        ["Send an authenticated POST request"],
        ["Building full CRUD frontends", "Integrating third-party APIs", "Authenticated dashboards"],
        ["What HTTP methods map to Create/Read/Update/Delete?", "Why must you check res.ok after a fetch call?"],
        "Build GET, POST, and DELETE functions against https://jsonplaceholder.typicode.com, each with proper error handling.",
    ),
    T(
        "js-projects", "JavaScript Projects", "Advanced",
        ["To-Do App", "Weather App", "Quiz App", "Expense Tracker"],
        "Combining concepts into complete, real projects.",
        "Building complete small projects is where DOM manipulation, events, arrays, and async fetch come "
        "together into something real, touching state, persistence, rendering, and interaction all at once.",
        "let tasks = [];\nfunction addTask(text) {\n  tasks.push({ text, done: false });\n  render();\n}",
        ["Add a task to an in-memory state array"],
        ["Portfolio projects for job applications", "Learning a concept hands-on end-to-end", "Prototyping product ideas quickly"],
        ["How would you structure state vs rendering logic in a vanilla JS app?", "How do you persist app state across page reloads?"],
        "Extend the to-do example with delete and toggle-complete functionality, and persist the tasks array to localStorage.",
    ),
    T(
        "js-interview", "Interview Preparation", "Advanced",
        ["Output-Based Questions", "Coding Questions", "Scenario Questions"],
        "Common JavaScript interview question patterns.",
        "JavaScript interviews commonly test output-prediction questions (closures, hoisting, this binding), "
        "practical coding problems, and scenario questions about real-world tradeoffs.",
        "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// what does this log, and why?",
        ["Predict the output of a classic var/closure interview question"],
        ["Technical screening interviews", "Take-home coding assessments", "System design discussions involving async JS"],
        ["Why does the var/setTimeout example above log 3, 3, 3?", "How would using let instead of var change the result?"],
        "Predict the output of the var/setTimeout example above, then rewrite it with let and explain why the result changes.",
    ),
    T(
        "js-references", "Best Practices & References", "Advanced",
        ["MDN", "ESLint/Prettier", "Coding Standards"],
        "Good habits and where to look things up.",
        "Good JavaScript habits include preferring const by default, using strict equality, and keeping "
        "functions small and focused. MDN is the canonical documentation source, and ESLint/Prettier enforce "
        "consistent code quality and style.",
        "const MAX_RETRIES = 3;\nfunction isValidEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}",
        ["A small, well-named, single-purpose helper function"],
        ["Maintaining consistent code style across a team", "Catching bugs automatically before code review", "Onboarding new developers to a codebase"],
        ["What's the difference between what ESLint and Prettier each do?", "Why is MDN considered the best JavaScript reference?"],
        "Install ESLint in a small project with the recommended config, and fix every warning it reports on an existing file.",
    ),
]

# ---------------------------------------------------------------------------
# REACT — 21 topics
# ---------------------------------------------------------------------------
REACT_TOPICS = [
    T(
        "react-intro", "React Introduction", "Beginner",
        ["What is React?", "Virtual DOM", "Why React?", "Setup"],
        "What React is and why it's popular for building UIs.",
        "React is a JavaScript library for building user interfaces out of reusable components. It uses a "
        "virtual DOM to efficiently update only the parts of the page that actually changed, and its "
        "declarative style means you describe what the UI should look like for a given state.",
        "function App() {\n  return <h1>Hello, EduMind!</h1>;\n}\nexport default App;",
        ["A minimal React component rendering a heading"],
        ["Single-page applications", "Interactive dashboards", "Component-driven design systems"],
        ["What problem does the virtual DOM solve?", "How is React different from a full framework like Angular?"],
        "Set up a new React project with `npm create vite@latest my-app -- --template react` and display your name in place of the default page.",
    ),
    T(
        "react-jsx", "JSX", "Beginner",
        ["Syntax", "Expressions in JSX", "Attributes"],
        "Writing HTML-like markup inside JavaScript.",
        "JSX is a syntax extension that lets you write HTML-like markup directly in JavaScript, compiled into "
        "React.createElement() calls. Any JS expression can be embedded inside {}, and attributes use "
        "camelCase (className, onClick).",
        "function Greeting({ name }) {\n  const hour = new Date().getHours();\n  return <h1 className=\"title\">{hour < 12 ? 'Good morning' : 'Hello'}, {name}!</h1>;\n}",
        ["Embed a conditional expression directly inside JSX"],
        ["Dynamic, data-driven UI markup", "Conditional greeting/status displays", "Reusable presentational components"],
        ["Why must JSX return a single root element?", "Why does JSX use className instead of class?"],
        "Build a component that takes a score prop and conditionally renders 'Pass' or 'Fail' using a ternary inside the JSX.",
    ),
    T(
        "react-components", "Components", "Beginner",
        ["Functional Components", "Composition", "Reusability"],
        "Building UIs from small, reusable pieces.",
        "Functional components are the modern standard in React. Components are meant to be reusable and "
        "composable — small, focused components combine to build larger UIs.",
        "function Avatar({ src, name }) {\n  return <img src={src} alt={name} className=\"avatar\" />;\n}\nfunction UserCard({ user }) {\n  return (\n    <div className=\"card\">\n      <Avatar src={user.avatar} name={user.name} />\n      <h3>{user.name}</h3>\n    </div>\n  );\n}",
        ["Compose a smaller Avatar component inside UserCard"],
        ["Design systems and component libraries", "Reusable cards, buttons, and form fields", "Page layouts built from smaller pieces"],
        ["Why must component names start with a capital letter?", "Why is composition preferred over inheritance in React?"],
        "Break a large 'profile page' component into three smaller ones — Avatar, UserInfo, UserStats — and compose them inside a ProfilePage.",
    ),
    T(
        "react-props", "Props", "Beginner",
        ["Passing Props", "Default Props", "children", "Prop Drilling"],
        "Passing data from parent to child components.",
        "Props are how a parent passes data down to a child component, read-only from the child's "
        "perspective. The special children prop holds whatever is nested between a component's tags.",
        "function Button({ label = 'Click me', onClick, children }) {\n  return <button onClick={onClick}>{children || label}</button>;\n}",
        ["A reusable button with a default label and children support"],
        ["Reusable, configurable UI components", "Passing callbacks down to child components", "Building component libraries"],
        ["Can a child component modify the props it receives?", "What is 'prop drilling', and how can you avoid it?"],
        "Build a reusable Card component that accepts a title prop and renders whatever children are passed inside it.",
    ),
    T(
        "react-state", "State (useState)", "Beginner",
        ["useState", "Updating State", "State vs Props"],
        "Managing data that changes over time within a component.",
        "State is data that changes over time and belongs to a specific component, managed with useState, "
        "which returns the current value and a setter function. Calling the setter triggers a re-render.",
        "function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}",
        ["A button that increments its own state on click"],
        ["Interactive counters and toggles", "Form input state", "UI that updates based on user interaction"],
        ["Why shouldn't you mutate state directly?", "When should you use the functional updater form, setCount(prev => ...)?"],
        "Build a like button that toggles a filled/outline heart icon and increments a like count only when liked, not un-liked.",
    ),
    T(
        "react-events", "Handling Events", "Beginner",
        ["onClick/onChange", "Event Object", "Passing Arguments"],
        "Responding to user interaction in React.",
        "React wraps native browser events in a SyntheticEvent, attached via camelCase JSX props like onClick "
        "and onChange. Handlers receive the event object as their first argument.",
        "function SearchBox() {\n  const [query, setQuery] = useState('');\n  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;\n}",
        ["A controlled input that updates state on change"],
        ["Search boxes and filters", "Form field handling", "Keyboard shortcut handling"],
        ["How do you pass an argument to an event handler in JSX?", "What does e.target.value give you inside onChange?"],
        "Build a form input that only submits when Enter is pressed and the input isn't empty, showing an error message otherwise.",
    ),
    T(
        "react-conditional", "Conditional Rendering", "Intermediate",
        ["Ternary", "Logical &&", "Returning null"],
        "Showing different UI based on state or props.",
        "Conditional rendering uses plain JavaScript — a ternary inline in JSX for two options, or && for "
        "rendering something only when a condition is true, since false/null/undefined render nothing.",
        "function StatusBadge({ isOnline }) {\n  return (\n    <div>\n      {isOnline ? <span>\ud83d\udfe2 Online</span> : <span>\u26aa Offline</span>}\n    </div>\n  );\n}",
        ["Render one of two badges based on a boolean prop"],
        ["Loading/error/success UI states", "Feature flags and permission-based UI", "Empty-state messaging"],
        ["Why does {0 && <Component />} render '0' instead of nothing?", "When would an if/else block be clearer than a nested ternary?"],
        "Build a component that shows a loading spinner, an error message, or the actual data, based on loading/error/data props.",
    ),
    T(
        "react-lists", "Rendering Lists", "Intermediate",
        ["map()", "Keys", "Filtering"],
        "Rendering arrays of data as UI elements.",
        "Lists are rendered by mapping an array to JSX elements with .map(), and each element needs a unique "
        "key prop so React can efficiently track changes between renders.",
        "function SkillList({ skills, query }) {\n  const visible = skills.filter(s => s.toLowerCase().includes(query.toLowerCase()));\n  return <ul>{visible.map(skill => <li key={skill}>{skill}</li>)}</ul>;\n}",
        ["Filter and render a list with stable keys"],
        ["Rendering search results", "Product/course listing pages", "Comment threads and feeds"],
        ["Why shouldn't you use the array index as a key in a dynamic list?", "What happens if list items are missing keys?"],
        "Build a searchable list of skills that filters as the user types into a search box, using a stable key for each item.",
    ),
    T(
        "react-forms", "Forms", "Intermediate",
        ["Controlled Components", "Uncontrolled Components", "Validation"],
        "Managing form input state in React.",
        "A controlled component ties an input's value to React state via value and onChange, making React the "
        "'single source of truth'. An uncontrolled component reads its value from the DOM via a ref instead.",
        "function SignupForm() {\n  const [email, setEmail] = useState('');\n  const [error, setError] = useState('');\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    if (!email.includes('@')) { setError('Enter a valid email'); return; }\n    setError('');\n  };\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={email} onChange={(e) => setEmail(e.target.value)} />\n      {error && <p>{error}</p>}\n    </form>\n  );\n}",
        ["A controlled form with inline validation"],
        ["Signup and login forms", "Multi-step wizards", "Search/filter form controls"],
        ["What's the tradeoff between controlled and uncontrolled components?", "Why must e.preventDefault() be called in onSubmit?"],
        "Build a signup form with email and password fields that shows a validation error if the password is under 8 characters.",
    ),
    T(
        "react-hooks", "Hooks", "Intermediate",
        ["useState", "useEffect", "useContext", "useRef", "Custom Hooks"],
        "Using state and side effects in functional components.",
        "Hooks let functional components use state and other React features. useEffect runs side effects in "
        "response to renders, and custom Hooks extract reusable stateful logic into your own functions.",
        "function useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    const onResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', onResize);\n    return () => window.removeEventListener('resize', onResize);\n  }, []);\n  return width;\n}",
        ["A custom Hook that tracks window width"],
        ["Data fetching on component mount", "Syncing with browser APIs (resize, scroll)", "Sharing reusable logic across components"],
        ["Why must useEffect's cleanup function be returned?", "What's the difference between an empty and omitted dependency array?"],
        "Write a custom useLocalStorage(key, initialValue) Hook that behaves like useState but persists its value to localStorage.",
    ),
    T(
        "react-styling", "Styling", "Intermediate",
        ["CSS Modules", "Tailwind CSS", "styled-components"],
        "Different ways to style React components.",
        "React components can be styled with CSS Modules (auto-scoped class names), utility-first frameworks "
        "like Tailwind, or CSS-in-JS libraries like styled-components.",
        "function Button({ children }) {\n  return (\n    <button className=\"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700\">\n      {children}\n    </button>\n  );\n}",
        ["A button styled entirely with Tailwind utility classes"],
        ["Rapid UI prototyping (Tailwind)", "Scoped, collision-free component styles (CSS Modules)", "Dynamic, prop-based styling (styled-components)"],
        ["How do CSS Modules prevent global class name collisions?", "What's a tradeoff of using Tailwind over hand-written CSS?"],
        "Style the same button three ways — plain CSS, Tailwind classes, and styled-components — and compare the developer experience.",
    ),
    T(
        "react-router", "React Router", "Advanced",
        ["BrowserRouter", "Routes", "Route Params", "Navigation"],
        "Client-side routing for multi-page React apps.",
        "React Router adds client-side routing, letting different URLs render different components without a "
        "full page reload. useParams() reads dynamic segments like :id from the URL.",
        "import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';\nfunction SkillPage() {\n  const { skillName } = useParams();\n  return <h1>Learning: {skillName}</h1>;\n}",
        ["Read a dynamic URL segment with useParams"],
        ["Multi-page single-page applications", "Dynamic detail pages (product/user/id)", "Protected/authenticated routes"],
        ["How does <Link> differ from a plain <a> tag in a React app?", "What is useParams() used for?"],
        "Add a route with a dynamic :id parameter that displays a different skill's details based on the URL, plus a navigation link for each skill.",
    ),
    T(
        "react-api", "Fetching Data", "Advanced",
        ["useEffect + fetch", "Loading/Error State", "axios"],
        "Loading data from an API into a React component.",
        "Fetching data typically happens inside useEffect on mount, tracked with loading/error/data state so "
        "the UI can show a spinner, an error, or the actual content at the right time.",
        "function SkillsList() {\n  const [skills, setSkills] = useState([]);\n  const [loading, setLoading] = useState(true);\n  useEffect(() => {\n    fetch('/api/skills').then(res => res.json()).then(setSkills).finally(() => setLoading(false));\n  }, []);\n  if (loading) return <p>Loading...</p>;\n  return <ul>{skills.map(s => <li key={s.id}>{s.name}</li>)}</ul>;\n}",
        ["Fetch a list on mount and show a loading state"],
        ["Dashboards pulling live backend data", "Search-as-you-type against an API", "Infinite scroll / paginated lists"],
        ["Why does the fetch run only once with an empty dependency array?", "Where should you handle a fetch triggered by a button click, vs on mount?"],
        "Build a component that fetches a list of posts and shows a retry button when the fetch fails.",
    ),
    T(
        "react-context", "Context API", "Advanced",
        ["createContext", "Provider", "useContext"],
        "Sharing data across components without prop drilling.",
        "Context lets you share data across many components without manually passing props through every "
        "level. You wrap the relevant tree with a Provider and read it with useContext().",
        "const ThemeContext = createContext('light');\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>Click me</button>;\n}",
        ["Read a theme value from context in a deeply nested component"],
        ["Global theme/dark-mode toggles", "Authenticated user data across an app", "Localization/language settings"],
        ["When is Context a better fit than passing props down?", "What happens to components reading context when the Provider's value changes?"],
        "Build a ThemeContext with a toggle function, and let any component switch the app between light and dark mode.",
    ),
    T(
        "react-redux", "State Management (Redux)", "Advanced",
        ["Store", "Actions/Reducers", "Redux Toolkit", "useSelector/useDispatch"],
        "Centralized state management for larger apps.",
        "Redux centralizes an app's state in a single store, updated only through dispatched actions handled "
        "by pure reducers. Redux Toolkit reduces boilerplate with createSlice.",
        "const counterSlice = createSlice({\n  name: 'counter',\n  initialState: { value: 0 },\n  reducers: { increment: (state) => { state.value += 1; } }\n});",
        ["Define a Redux Toolkit slice with one action"],
        ["Large apps with complex shared state", "Undo/redo and time-travel debugging", "Predictable, testable state transitions"],
        ["Why must reducers be pure functions?", "How does useSelector avoid unnecessary re-renders?"],
        "Build a Redux Toolkit slice for a shopping cart with addItem and removeItem actions, connected via useSelector/useDispatch.",
    ),
    T(
        "react-performance", "Performance Optimization", "Advanced",
        ["React.memo", "useMemo/useCallback", "Lazy Loading"],
        "Avoiding unnecessary renders and reducing bundle size.",
        "React.memo skips re-rendering if props haven't changed, useMemo/useCallback cache values and "
        "functions between renders, and React.lazy() with code splitting loads parts of the app only when "
        "needed.",
        "const ExpensiveList = React.memo(function ExpensiveList({ items }) {\n  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;\n});",
        ["Prevent a list component from re-rendering unnecessarily"],
        ["Large lists/tables with frequent parent re-renders", "Reducing initial bundle size (lazy loading)", "Expensive computed values (useMemo)"],
        ["When does React.memo actually help performance?", "Why wrap a React.lazy() component in Suspense?"],
        "Wrap an expensive list component in React.memo and verify with console.log that it stops re-rendering when a sibling's unrelated state changes.",
    ),
    T(
        "react-auth", "Authentication", "Advanced",
        ["JWT", "Protected Routes", "Login/Logout"],
        "Handling login state and protecting routes.",
        "A typical React auth flow sends login credentials to a server, receives a JWT back, stores it, and "
        "attaches it to subsequent requests. Protected routes redirect unauthenticated users to login.",
        "function ProtectedRoute({ children }) {\n  const token = localStorage.getItem('token');\n  return token ? children : <Navigate to=\"/login\" />;\n}",
        ["Gate a route behind a stored auth token"],
        ["Dashboards requiring login", "Role-based access control", "Persisting sessions across page reloads"],
        ["Why isn't client-side route protection alone sufficient security?", "What are the security tradeoffs of storing a JWT in localStorage?"],
        "Build a ProtectedRoute wrapper that redirects unauthenticated users to login, and a logout button that clears the token.",
    ),
    T(
        "react-testing", "Testing", "Advanced",
        ["Jest", "React Testing Library", "Component Testing"],
        "Writing automated tests for React components.",
        "Jest is the test runner, and React Testing Library renders components in a simulated DOM, encouraging "
        "testing the way a user would interact with them.",
        "test('increments counter on click', () => {\n  render(<Counter />);\n  fireEvent.click(screen.getByRole('button'));\n  expect(screen.getByText('Clicked 1 times')).toBeInTheDocument();\n});",
        ["Simulate a click and assert on the resulting UI text"],
        ["Regression-testing UI behavior", "CI pipelines that block bad merges", "Confidence when refactoring components"],
        ["Why does Testing Library favor queries like getByRole over CSS selectors?", "What's the difference between fireEvent and userEvent?"],
        "Write a test that renders the SignupForm and confirms an error message appears when submitted with an invalid email.",
    ),
    T(
        "react-deployment", "Deployment", "Advanced",
        ["Build", "Vercel/Netlify", "Environment Variables"],
        "Shipping a React app to production.",
        "Deploying starts with a production build, which outputs optimized static files. Vercel and Netlify "
        "auto-deploy from a GitHub repo, and environment variables need a specific prefix to reach client "
        "code.",
        "npm run build\n# deploy the /dist folder to Vercel or Netlify",
        ["Produce a production build ready to deploy"],
        ["Shipping a portfolio or side project live", "Preview URLs for pull requests", "Continuous deployment pipelines"],
        ["Why must client-exposed env vars use a specific prefix (VITE_/REACT_APP_)?", "What extra server config does client-side routing need in production?"],
        "Deploy a small React app to Vercel or Netlify connected to a GitHub repo, and confirm it auto-redeploys after a new commit.",
    ),
    T(
        "react-interview", "Interview Preparation", "Advanced",
        ["Rules of Hooks", "Reconciliation", "Common Questions"],
        "Common React interview question patterns.",
        "React interviews probe the virtual DOM and reconciliation, why keys matter in lists, and the Rules of "
        "Hooks — only call them at the top level, never conditionally.",
        "function Bad() {\n  const [show, setShow] = useState(true);\n  if (show) {\n    const [count, setCount] = useState(0); // breaks the Rules of Hooks\n  }\n  return null;\n}",
        ["Spot a Rules-of-Hooks violation"],
        ["Technical screening interviews", "Code review feedback on Hook usage", "Debugging mysterious re-render bugs"],
        ["Why must Hooks always run in the same order on every render?", "What does 'lifting state up' mean?"],
        "Explain out loud why the Bad component above breaks the Rules of Hooks, then rewrite it correctly.",
    ),
    T(
        "react-references", "Best Practices & References", "Advanced",
        ["react.dev", "Common Mistakes", "Useful Libraries"],
        "Good habits and where to look things up.",
        "react.dev is the official, up-to-date documentation. Best practices include keeping components small "
        "and focused, and avoiding mistakes like mutating state directly or using array indices as keys.",
        "// Quick reference\nuseState(initial)\nuseEffect(fn, [deps])\nkey={uniqueId} // required on list items, not index",
        ["A quick-reference list of core Hook signatures"],
        ["Onboarding new React developers", "Code review checklists", "Interview last-minute review"],
        ["What are two of the most common React mistakes to watch for?", "What companion libraries commonly pair with React (routing, state, data-fetching)?"],
        "Review one of your own components against this checklist and fix any mistakes you find — mutated state, missing keys, or missing effect cleanup.",
    ),
]

# ---------------------------------------------------------------------------
# TYPESCRIPT — 3 topics
# ---------------------------------------------------------------------------
TYPESCRIPT_TOPICS = [
    T(
        "types", "Types & Interfaces", "Beginner",
        ["Basic Types", "Interfaces", "Type Aliases"],
        "Adding static types on top of JavaScript.",
        "TypeScript adds static types on top of JavaScript, letting you annotate variables, parameters, and "
        "return values with types like string, number, and custom object shapes via interfaces, catching type "
        "errors at compile time instead of at runtime.",
        "interface User {\n  name: string;\n  age: number;\n}\nfunction greet(user: User): string {\n  return `Hello, ${user.name}`;\n}",
        ["A typed function accepting a User interface"],
        ["Catching bugs before runtime in large codebases", "Self-documenting function signatures", "Safer refactors across a team"],
        ["What's the difference between interface and type in TypeScript?", "Does TypeScript affect the actual JavaScript that runs?"],
        "Define an interface for a Product (id, name, price) and write a fully-typed function that calculates total price for an array of products.",
    ),
    T(
        "tsconfig", "tsconfig & Compiler", "Intermediate",
        ["compilerOptions", "strict mode", "target"],
        "Configuring how TypeScript compiles your project.",
        "tsconfig.json configures the compiler — target (which JS version to output), strict mode (enables "
        "full type-checking), and module resolution. Editors use this file for real-time feedback.",
        "{\n  \"compilerOptions\": {\n    \"target\": \"ES2020\",\n    \"strict\": true,\n    \"outDir\": \"./dist\"\n  }\n}",
        ["A minimal strict-mode tsconfig"],
        ["Enforcing type safety project-wide", "CI type-checking without emitting files", "Targeting specific JS runtime versions"],
        ["What does strict: true actually enable?", "How would you type-check a project without generating output files?"],
        "Create a tsconfig.json with strict mode enabled, then intentionally write a function with a type error and observe the compiler catch it.",
    ),
    T(
        "advanced", "Generics & Utility Types", "Advanced",
        ["Generics", "Union Types", "Pick/Omit/Partial"],
        "Writing flexible, type-safe reusable code.",
        "Generics let you write reusable functions or types that work with multiple types while preserving "
        "type safety. Utility types like Pick<T> and Omit<T> transform existing types without rewriting them.",
        "function firstItem<T>(items: T[]): T | undefined {\n  return items[0];\n}\ntype User = { id: number; name: string; email: string };\ntype UserPreview = Pick<User, 'id' | 'name'>;",
        ["A generic function and a derived utility type"],
        ["Reusable, type-safe utility functions", "API response types derived from a base model", "Reducing type duplication across a codebase"],
        ["Why use a generic instead of `any`?", "What's the difference between Pick<T> and Omit<T>?"],
        "Write a generic function pluck<T, K extends keyof T>(items: T[], key: K) that extracts one property from every object in an array.",
    ),
]

# ---------------------------------------------------------------------------
# JAVA — 3 topics
# ---------------------------------------------------------------------------
JAVA_TOPICS = [
    T(
        "syntax", "Java Syntax Basics", "Beginner",
        ["main method", "Variables", "Data Types"],
        "Java's structure, static typing, and entry point.",
        "Java is a statically-typed, compiled language where every variable's type is declared explicitly, "
        "and code lives inside classes even for a simple program's entry point. Java compiles to bytecode "
        "that runs on the JVM.",
        "public class Main {\n    public static void main(String[] args) {\n        int age = 21;\n        String name = \"EduMind\";\n        System.out.println(name + \" is \" + age + \" years old\");\n    }\n}",
        ["A minimal Java program printing a formatted sentence"],
        ["Enterprise backend systems", "Android app development", "Large-scale, statically-typed codebases"],
        ["Why must the public class name match the filename?", "What does 'write once, run anywhere' mean for Java?"],
        "Write a Java program that declares variables for a name, age, and GPA, then prints a formatted summary sentence.",
    ),
    T(
        "oop", "Object-Oriented Programming", "Intermediate",
        ["Classes & Objects", "Inheritance", "Access Modifiers"],
        "Java's class-based approach to OOP.",
        "Java is fundamentally object-oriented — classes define objects with fields and methods, constructors "
        "initialize new objects, and extends implements inheritance. Access modifiers control encapsulation.",
        "class Animal {\n    protected String name;\n    Animal(String name) { this.name = name; }\n    String speak() { return name + \" makes a sound\"; }\n}\nclass Dog extends Animal {\n    Dog(String name) { super(name); }\n    @Override\n    String speak() { return name + \" barks\"; }\n}",
        ["A subclass overriding a parent's method"],
        ["Modeling real-world domain entities", "Enterprise application architecture", "Reusable class hierarchies/frameworks"],
        ["What must be the first statement in a subclass constructor?", "What's the purpose of the @Override annotation?"],
        "Create a Shape class with an abstract area() method, and Circle/Rectangle subclasses that implement it differently.",
    ),
    T(
        "collections", "Collections Framework", "Advanced",
        ["ArrayList", "HashMap", "HashSet", "Generics"],
        "Java's built-in data structures.",
        "Java's Collections Framework provides ready-made data structures: ArrayList (a resizable array), "
        "HashMap (key-value pairs), and HashSet (unique elements), all working with generics for type safety.",
        "List<String> skills = new ArrayList<>();\nskills.add(\"Java\");\nMap<String, Integer> scores = new HashMap<>();\nscores.put(\"Alice\", 92);",
        ["Populate an ArrayList and a HashMap"],
        ["Dynamic data storage in applications", "Fast key-based lookups", "De-duplicating collections with HashSet"],
        ["What does HashMap.get() return for a missing key?", "Why is an ArrayList more flexible than a plain array?"],
        "Build a HashMap that counts how many times each word appears in a sentence, splitting it with String.split().",
    ),
]

# ---------------------------------------------------------------------------
# C — 2 topics
# ---------------------------------------------------------------------------
C_TOPICS = [
    T(
        "basics", "C Basics", "Beginner",
        ["Variables & Types", "printf/scanf", "Compilation"],
        "Low-level programming fundamentals in C.",
        "C is a low-level, compiled, statically-typed language where you manage memory manually and every "
        "variable must be declared with an explicit type. Programs compile into a binary before running.",
        "#include <stdio.h>\n\nint main() {\n    int age = 21;\n    char name[] = \"EduMind\";\n    printf(\"%s is %d years old\\n\", name, age);\n    return 0;\n}",
        ["A minimal compiled C program"],
        ["Systems and embedded programming", "Operating system internals", "Performance-critical applications"],
        ["Why must printf's format specifiers match the argument types?", "What does `return 0;` from main signal?"],
        "Write a C program that declares an int, a float, and a char array, then prints all three with the correct format specifiers.",
    ),
    T(
        "stdlib", "Standard Library & Memory", "Intermediate",
        ["stdio.h/stdlib.h/string.h", "malloc/free"],
        "Using the standard library and managing memory manually.",
        "The C standard library provides essential functions by header. Since C has no garbage collection, "
        "memory allocated with malloc() must be manually freed with free().",
        "#include <stdlib.h>\n\nint main() {\n    int *nums = malloc(3 * sizeof(int));\n    nums[0] = 10; nums[1] = 20; nums[2] = 30;\n    free(nums);\n    return 0;\n}",
        ["Allocate, use, and free a small array"],
        ["Dynamic data structures (linked lists, trees)", "Buffer and memory management", "Interfacing with hardware/OS APIs"],
        ["What happens if you forget to call free() after malloc()?", "Why don't strcpy/strcat check buffer sizes?"],
        "Write a program that dynamically allocates an array for a user-specified number of integers, fills it, prints the sum, then frees the memory.",
    ),
]

# ---------------------------------------------------------------------------
# C++ — 2 topics
# ---------------------------------------------------------------------------
CPP_TOPICS = [
    T(
        "syntax", "C++ Syntax & Classes", "Beginner",
        ["cout/cin", "Classes", "Access Modifiers"],
        "C++'s object-oriented extensions to C.",
        "C++ extends C with object-oriented features while keeping manual memory control. It uses "
        "std::cout/std::cin for console I/O, and classes bundle data with the functions that operate on it.",
        "#include <iostream>\nusing namespace std;\n\nclass Student {\npublic:\n    string name;\n    int score;\n    void display() { cout << name << \": \" << score << endl; }\n};",
        ["A simple class with a display method"],
        ["Game engines and performance-critical software", "Competitive programming", "Systems requiring both speed and OOP structure"],
        ["What access level do class members have by default?", "What does the insertion operator << actually do?"],
        "Write a Student class with name, score, and a method that returns a letter grade, then create three instances and print each grade.",
    ),
    T(
        "stl", "Standard Template Library", "Advanced",
        ["vector", "map", "sort/find algorithms"],
        "Generic containers and algorithms in C++.",
        "The STL provides generic, reusable containers like vector (a resizable array) and map (key-value "
        "pairs), plus algorithms like sort() and find() that work across container types.",
        "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> nums = {5, 2, 8, 1};\nsort(nums.begin(), nums.end());",
        ["Sort a vector using the STL sort algorithm"],
        ["Competitive programming solutions", "Efficient dynamic collections", "Sorting and searching large datasets"],
        ["Why does sort() take iterators instead of the container directly?", "What's the tradeoff between map and unordered_map?"],
        "Use a vector and sort() to sort a list of student scores, then use a map to count how many students scored above 80 per class.",
    ),
]

# ---------------------------------------------------------------------------
# NODE.JS — 3 topics
# ---------------------------------------------------------------------------
NODEJS_TOPICS = [
    T(
        "intro", "Node.js Introduction", "Beginner",
        ["What is Node.js?", "Event-Driven Model", "Running Scripts"],
        "Running JavaScript outside the browser.",
        "Node.js is a JavaScript runtime built on Chrome's V8 engine that lets JavaScript run outside the "
        "browser. It's event-driven and non-blocking by default, so I/O operations don't halt the program "
        "while waiting.",
        "console.log('Running in Node.js!');\nconsole.log('Node version:', process.version);",
        ["Print runtime info from a Node script"],
        ["Backend servers and APIs", "Command-line tools", "Build tools and dev scripts"],
        ["What does 'non-blocking I/O' mean in practice?", "How do you run a Node.js script from the terminal?"],
        "Write a Node.js script that reads a file's contents asynchronously using fs.readFile and logs it.",
    ),
    T(
        "http", "Building an HTTP Server", "Intermediate",
        ["http module", "Request/Response", "Routing Basics"],
        "Creating a web server without a framework.",
        "Node's built-in http module lets you create a web server without any external framework — a "
        "callback runs for every incoming request. Frameworks like Express build on top of this.",
        "const http = require('http');\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'text/plain' });\n  res.end('Hello from Node.js!');\n});\nserver.listen(3000);",
        ["A raw HTTP server responding to any request"],
        ["Lightweight microservices", "Learning how frameworks like Express work under the hood", "Custom protocol/proxy servers"],
        ["What does res.writeHead() do before res.end()?", "Why do most real Node apps use a framework instead of raw http?"],
        "Extend the server above to return different responses for /home and /about, based on req.url.",
    ),
    T(
        "npm", "npm & Package Management", "Beginner",
        ["package.json", "npm install", "npm scripts"],
        "Managing dependencies and project scripts.",
        "npm installs and manages third-party packages, tracked in package.json. `npm install package-name` "
        "adds a dependency, and `npm run script-name` runs a defined script.",
        "// package.json\n{\n  \"scripts\": { \"start\": \"node index.js\" },\n  \"dependencies\": { \"express\": \"^4.18.0\" }\n}",
        ["A package.json with a start script and one dependency"],
        ["Installing and managing third-party libraries", "Standardizing project run/build commands", "Reproducible installs across a team"],
        ["What's the difference between dependencies and devDependencies?", "Why should node_modules never be committed to git?"],
        "Initialize a new Node project with `npm init -y`, install express, and add a start script that runs your server file.",
    ),
]

# ---------------------------------------------------------------------------
# MONGODB — 18 topics
# ---------------------------------------------------------------------------
MONGODB_TOPICS = [
    T(
        "mongodb-intro", "MongoDB Introduction", "Beginner",
        ["Documents", "Collections", "NoSQL vs SQL"],
        "What a document database is and why it's flexible.",
        "MongoDB is a NoSQL, document-oriented database that stores data as flexible, JSON-like documents "
        "grouped into collections, instead of rows and tables like a relational database. This schema "
        "flexibility suits rapidly evolving or unstructured data.",
        "// Example document in a \"students\" collection\n{\n  \"_id\": \"665f1a...\",\n  \"name\": \"Alice\",\n  \"scores\": [92, 88, 95]\n}",
        ["A document with a nested array field"],
        ["Rapidly evolving product catalogs", "Content management systems", "Apps with nested/hierarchical data"],
        ["What's the main structural difference between MongoDB and a relational database?", "What format does MongoDB store documents in internally?"],
        "Sketch what a \"products\" collection document would look like for an e-commerce site, including a nested \"dimensions\" object.",
    ),
    T(
        "mongodb-basics", "Databases & Collections", "Beginner",
        ["use", "createCollection", "find"],
        "The basic building blocks of a MongoDB deployment.",
        "A MongoDB deployment holds databases, each containing collections, each holding documents. The mongo "
        "shell or Compass (GUI) let you explore and query data directly.",
        "use edumind_db\ndb.createCollection(\"students\")\ndb.students.insertOne({ name: \"Alice\", score: 92 })\ndb.students.find()",
        ["Create a database, collection, and query it"],
        ["Exploring and prototyping a new schema", "Local development databases", "Quick data inspection via the shell"],
        ["Do you need to explicitly call createCollection() before inserting?", "What does db.collection.find() with no arguments return?"],
        "Create a database and a \"books\" collection, insert two book documents, then query all documents in it.",
    ),
    T(
        "mongodb-crud", "CRUD Operations", "Beginner",
        ["insertOne/Many", "updateOne/Many", "deleteOne/Many"],
        "Creating, reading, updating, and deleting documents.",
        "CRUD in MongoDB maps to insertOne()/insertMany(), find()/findOne(), updateOne()/updateMany(), and "
        "deleteOne()/deleteMany(). Update operators like $set change specific fields without overwriting the "
        "whole document.",
        "db.students.insertOne({ name: \"Bob\", score: 75 });\ndb.students.updateOne({ name: \"Bob\" }, { $set: { score: 80 } });\ndb.students.deleteOne({ name: \"Bob\" });",
        ["Insert, update one field, then delete a document"],
        ["User profile management", "Inventory stock updates", "Soft-delete/archival workflows"],
        ["What does the $set operator do differently from a plain replace?", "What's the risk of running deleteMany() with a broad filter?"],
        "Insert three student documents, update one student's score using $set, then delete students with a score below 60.",
    ),
    T(
        "mongodb-queries", "Query Operators", "Intermediate",
        ["$gt/$lt/$in", "$and/$or", "$regex"],
        "Filtering documents beyond simple equality.",
        "MongoDB's query operators let you filter beyond simple equality: comparison operators, $in for "
        "matching any value in a list, $and/$or for combining conditions, and $regex for pattern matching.",
        "db.students.find({ score: { $gte: 80, $lt: 95 } });\ndb.students.find({ name: { $in: [\"Alice\", \"Bob\"] } });",
        ["Filter by a numeric range and by a list of names"],
        ["Advanced search and filter UIs", "Range-based reporting (date/score ranges)", "Multi-condition dashboard filters"],
        ["What's a shorthand way to check if a field matches any of several values?", "How do you combine two conditions with OR logic?"],
        "Write a query that finds all students with a score between 70 and 90 whose name starts with 'A' using $regex.",
    ),
    T(
        "mongodb-projection", "Projection, Sort & Pagination", "Intermediate",
        ["Projection", "sort()", "limit()/skip()"],
        "Controlling which fields and how many results come back.",
        "Projection controls which fields a query returns, sort() orders results, and limit()/skip() "
        "paginate them.",
        "db.students.find({}, { name: 1, score: 1, _id: 0 })\n  .sort({ score: -1 })\n  .limit(5);",
        ["Return only two fields, sorted and limited"],
        ["Paginated API responses", "Leaderboards and top-N lists", "Reducing payload size for mobile clients"],
        ["How do you exclude a field while including everything else?", "How would you implement page-based pagination with skip/limit?"],
        "Write a query returning just the title and author of the 10 most recently published books, skipping the first 5.",
    ),
    T(
        "mongodb-indexing", "Indexing", "Intermediate",
        ["createIndex", "Compound Indexes", "explain()"],
        "Speeding up queries with indexes.",
        "Indexes dramatically speed up queries on fields you filter or sort by often, at the cost of slightly "
        "slower writes. By default, every collection has an index on _id.",
        "db.students.createIndex({ email: 1 });\ndb.students.find({ email: \"alice@example.com\" });\ndb.students.getIndexes();",
        ["Create an index and use it in a query"],
        ["Speeding up frequent lookups (login by email)", "Enforcing uniqueness with a unique index", "Optimizing slow production queries"],
        ["What happens to a query's performance without a needed index?", "How do you check whether a query actually used an index?"],
        "Create an index on a \"score\" field and use .find({score: {$gt: 90}}).explain() to confirm it's used.",
    ),
    T(
        "mongodb-aggregation", "Aggregation Pipeline", "Advanced",
        ["$match", "$group", "$sort", "$project"],
        "Processing documents through a pipeline of stages.",
        "The aggregation framework processes documents through a pipeline of stages — $match (filter), $group "
        "(aggregate), $sort — each stage's output feeding into the next.",
        "db.students.aggregate([\n  { $match: { score: { $gte: 60 } } },\n  { $group: { _id: \"$class\", avgScore: { $avg: \"$score\" } } },\n  { $sort: { avgScore: -1 } }\n]);",
        ["Group students by class and compute an average score"],
        ["Analytics dashboards and reports", "Sales/revenue summaries by category", "Cohort and funnel analysis"],
        ["Why is it good practice to put $match early in a pipeline?", "What does the _id field mean inside a $group stage?"],
        "Write an aggregation pipeline that groups orders by customer and returns each customer's total spend, sorted highest first.",
    ),
    T(
        "mongodb-relationships", "Modeling Relationships", "Advanced",
        ["Embedding", "Referencing"],
        "Choosing between embedding and referencing related data.",
        "MongoDB models relationships two ways: embedding (nesting related data directly, good for data "
        "always accessed together) and referencing (storing an _id pointing elsewhere, good for large or "
        "shared data).",
        "// Embedded\n{ title: \"My Post\", comments: [{ text: \"Nice!\", user: \"Bob\" }] }\n\n// Referenced\n{ title: \"My Post\", authorId: ObjectId(\"...\") }",
        ["Compare embedding vs referencing for the same relationship"],
        ["Blog posts with embedded comments", "Users referenced across many orders", "Balancing read performance vs data duplication"],
        ["When would you choose to embed data instead of reference it?", "Does MongoDB enforce foreign-key-style referential integrity automatically?"],
        "Design a schema for a course platform where you decide, and justify, whether enrollments should be embedded in a student document or referenced.",
    ),
    T(
        "mongodb-schema", "Schema Design & Validation", "Advanced",
        ["Design for Queries", "$jsonSchema Validation"],
        "Designing flexible-but-safe document schemas.",
        "Even though MongoDB is schema-flexible, thoughtful design still matters — driven by your app's "
        "read/write patterns. $jsonSchema validators can enforce structure on top of that flexibility.",
        "db.createCollection(\"students\", {\n  validator: {\n    $jsonSchema: {\n      required: [\"name\", \"score\"],\n      properties: { score: { bsonType: \"int\", minimum: 0, maximum: 100 } }\n    }\n  }\n});",
        ["Add validation rules to a new collection"],
        ["Preventing malformed data from bad application code", "Enforcing required fields without an ORM", "Guarding against invalid value ranges"],
        ["What does 'design for your queries' mean as a MongoDB principle?", "Why might you intentionally duplicate data across documents?"],
        "Design a schema (with validation rules) for a \"products\" collection requiring a name, a positive price, and a category from a fixed list.",
    ),
    T(
        "mongodb-node", "MongoDB with Node.js", "Advanced",
        ["MongoClient", "async/await Queries"],
        "Connecting a Node app to MongoDB with the official driver.",
        "The official mongodb Node.js driver connects a Node app to MongoDB using MongoClient, letting you run "
        "the same CRUD and aggregation operations from JavaScript with Promises/async-await.",
        "const { MongoClient } = require('mongodb');\nconst client = new MongoClient('mongodb://localhost:27017');\nawait client.connect();\nconst db = client.db('edumind_db');\nconst student = await db.collection('students').findOne({ name: 'Alice' });",
        ["Connect and run a findOne query from Node"],
        ["Backend APIs powered by MongoDB", "Server-side data processing scripts", "Building Express + MongoDB apps"],
        ["Why should you reuse one MongoClient instead of connecting per-request?", "What does the driver return — raw BSON or native JS objects?"],
        "Write a Node script using the MongoDB driver that connects, inserts a new student, then reads it back and logs it.",
    ),
    T(
        "mongodb-mongoose", "Mongoose ODM", "Advanced",
        ["Schema", "Model", "Validation"],
        "Modeling MongoDB documents as JavaScript objects.",
        "Mongoose is an Object Data Modeling library for MongoDB in Node.js — define Schemas with types and "
        "validation, compile them into Models, and work with documents as JS objects.",
        "const studentSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  score: { type: Number, min: 0, max: 100 }\n});\nconst Student = mongoose.model('Student', studentSchema);",
        ["Define a validated schema and compile it into a Model"],
        ["Enforcing consistent structure across a Node app", "Adding hooks/middleware around saves", "Rapid CRUD API development"],
        ["What does Mongoose validation add on top of the raw driver?", "What convenience methods does a Mongoose Model provide?"],
        "Define a Mongoose schema for a Product with a required name and a price that must be greater than 0, then create and save one.",
    ),
    T(
        "mongodb-transactions", "Transactions", "Advanced",
        ["Multi-document Transactions", "Sessions"],
        "Grouping operations so they succeed or fail together.",
        "Multi-document transactions let you group several operations so they all succeed or all fail "
        "together, preserving consistency across multiple documents or collections.",
        "const session = client.startSession();\nawait session.withTransaction(async () => {\n  await accounts.updateOne({ name: 'A' }, { $inc: { balance: -50 } }, { session });\n  await accounts.updateOne({ name: 'B' }, { $inc: { balance: 50 } }, { session });\n});",
        ["Transfer funds between two accounts atomically"],
        ["Financial transfers between accounts", "Multi-step order processing", "Any update that must be all-or-nothing"],
        ["What infrastructure does MongoDB require to support transactions?", "What happens to earlier operations in a transaction if a later one fails?"],
        "Simulate a funds transfer between two account documents inside a transaction, and verify balances stay consistent if you force an error mid-transaction.",
    ),
    T(
        "mongodb-security", "Security & Access Control", "Advanced",
        ["Authentication", "Role-Based Access", "Encryption"],
        "Protecting a MongoDB deployment.",
        "MongoDB security involves enabling authentication, role-based access control giving each user only "
        "the permissions they need, and encrypting data in transit (TLS) and at rest.",
        "db.createUser({\n  user: \"appUser\",\n  pwd: \"strongPasswordHere\",\n  roles: [{ role: \"readWrite\", db: \"edumind_db\" }]\n});",
        ["Create a user restricted to one database's read/write access"],
        ["Preventing unauthorized data access", "Compliance in regulated industries", "Limiting blast radius of a compromised credential"],
        ["Why is an authentication-free MongoDB instance dangerous?", "What does the principle of least privilege mean for database users?"],
        "Create a read-only MongoDB user for a reporting dashboard and verify it can query but not write to a collection.",
    ),
    T(
        "mongodb-atlas", "MongoDB Atlas (Cloud)", "Intermediate",
        ["Clusters", "Connection Strings", "Network Access"],
        "Using MongoDB's fully-managed cloud service.",
        "MongoDB Atlas is MongoDB's official fully-managed cloud database service, handling provisioning, "
        "backups, scaling, and monitoring, with a connection string you plug into your app.",
        "// .env\nMONGODB_URI=mongodb+srv://user:password@cluster0.mongodb.net/edumind_db",
        ["An environment-variable-based Atlas connection string"],
        ["Zero-maintenance production databases", "Learning/prototyping with a free-tier cluster", "Globally distributed database deployments"],
        ["Why shouldn't a connection string with credentials be committed to source control?", "What does Atlas's Network Access setting control?"],
        "Create a free MongoDB Atlas cluster, get its connection string, and connect a small Node script to insert one test document.",
    ),
    T(
        "mongodb-performance", "Performance Tuning", "Advanced",
        ["explain()", "Index Strategy", "Query Optimization"],
        "Diagnosing and fixing slow MongoDB queries.",
        "Performance tuning centers on indexing the fields you actually query and sort by, using explain() to "
        "verify queries use those indexes instead of scanning the whole collection.",
        "db.students.find({ score: { $gt: 90 } }).explain(\"executionStats\");",
        ["Inspect whether a query used an index"],
        ["Diagnosing slow production queries", "Capacity planning for growing collections", "Reducing database load/costs"],
        ["What does a COLLSCAN in explain() output usually indicate?", "How should compound indexes order equality vs range fields?"],
        "Run .explain() on a query before and after adding an index on the filtered field, and compare the number of documents examined.",
    ),
    T(
        "mongodb-projects", "MongoDB Projects", "Advanced",
        ["Blog Backend", "Task Manager", "E-commerce Catalog"],
        "Applying MongoDB to complete backend projects.",
        "Applying MongoDB to real projects is where schema design decisions, CRUD, and aggregation come "
        "together into a working backend.",
        "{\n  title: \"Finish MongoDB module\",\n  done: false,\n  tags: [\"study\", \"backend\"],\n  createdAt: new Date()\n}",
        ["A task document ready for a CRUD API"],
        ["Backend for a to-do or project management app", "Product catalog for an online store", "Blog platform with posts and comments"],
        ["What's a sensible first schema to build before adding complexity?", "Why seed a database with realistic sample data early?"],
        "Design and build a task manager backend with MongoDB and Express, supporting create, list, complete, and delete operations on tasks.",
    ),
    T(
        "mongodb-interview", "Interview Preparation", "Advanced",
        ["SQL vs MongoDB", "Embedding vs Referencing", "Aggregation Questions"],
        "Common MongoDB interview question patterns.",
        "MongoDB interview questions often cover when to use MongoDB vs a relational database, the tradeoffs "
        "of embedding vs referencing, and practical aggregation pipeline problems.",
        "db.orders.aggregate([\n  { $match: { customerId: 5 } },\n  { $group: { _id: null, total: { $sum: \"$amount\" } } }\n]);",
        ["Compute a customer's total order amount with aggregation"],
        ["Backend/database design interviews", "System design rounds involving data modeling", "Take-home database challenges"],
        ["When would you choose MongoDB over a relational database, and vice versa?", "How would you explain the embedding vs referencing tradeoff to an interviewer?"],
        "Explain when you'd choose to embed vs reference data in MongoDB, using a concrete example like a social media app's posts and comments.",
    ),
    T(
        "mongodb-references", "Best Practices & References", "Advanced",
        ["Official Docs", "Compass", "mongosh"],
        "Where to look things up and tools to use.",
        "The official MongoDB documentation is the authoritative reference for query operators and aggregation "
        "stages. MongoDB Compass and mongosh are the two main tools for exploring data directly.",
        "db.collection.find(filter, projection)\ndb.collection.updateOne(filter, { $set: {...} })\ndb.collection.aggregate([ { $match }, { $group } ])",
        ["A quick reference of the most common operations"],
        ["Quick lookup while writing queries", "Visual schema exploration with Compass", "Interview and exam review"],
        ["What does MongoDB Compass let you do that the shell doesn't as easily?", "Where would you look up an aggregation stage you don't remember exactly?"],
        "Use MongoDB Compass (or the shell) to explore an existing collection's schema and build one filtered query visually.",
    ),
]

# ---------------------------------------------------------------------------
# MYSQL — 2 topics
# ---------------------------------------------------------------------------
MYSQL_TOPICS = [
    T(
        "intro", "MySQL Introduction", "Beginner",
        ["Databases & Tables", "AUTO_INCREMENT", "Data Types"],
        "Getting started with the most widely used relational database.",
        "MySQL is one of the most widely used relational database management systems, using standard SQL "
        "with some MySQL-specific extensions. It organizes data into databases containing tables.",
        "CREATE DATABASE edumind_db;\nUSE edumind_db;\nCREATE TABLE students (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100));\nINSERT INTO students (name) VALUES ('Alice');",
        ["Create a database, table, and insert a row"],
        ["Backend data storage for web apps", "Reporting and admin dashboards", "E-commerce and CMS platforms"],
        ["What does AUTO_INCREMENT do for a primary key column?", "When would you use TEXT instead of VARCHAR(n)?"],
        "Create a MySQL database with a products table (id, name, price), and insert three products.",
    ),
    T(
        "queries", "MySQL Queries", "Intermediate",
        ["SELECT/WHERE/JOIN", "LIMIT", "IFNULL"],
        "Filtering, joining, and paginating MySQL data.",
        "MySQL supports the full standard SQL query toolkit plus functions like LIMIT for pagination and "
        "IFNULL() for handling NULLs.",
        "SELECT name, price\nFROM products\nWHERE price > 20\nORDER BY price DESC\nLIMIT 5;",
        ["Filter, sort, and limit product results"],
        ["Product/search listing pages", "Top-N reports (best sellers, highest scores)", "Handling missing data gracefully with IFNULL"],
        ["What does LIMIT combined with OFFSET achieve?", "What does IFNULL(column, default) do?"],
        "Write a query that returns the top 3 highest-priced products per category using a JOIN and ORDER BY.",
    ),
]

# ---------------------------------------------------------------------------
# GIT — 2 topics
# ---------------------------------------------------------------------------
GIT_TOPICS = [
    T(
        "basics", "Git Basics", "Beginner",
        ["init/add/commit", "status", "log"],
        "Tracking changes to your project over time.",
        "Git is a distributed version control system that tracks changes through commits — snapshots you can "
        "return to. The core workflow is: modify files, git add to stage, git commit to save a snapshot.",
        "git init\ngit add index.html\ngit commit -m \"Add initial homepage\"\ngit log --oneline",
        ["Initialize a repo and make a first commit"],
        ["Tracking project history", "Safely experimenting without losing work", "Collaborating on shared codebases"],
        ["What's the difference between git add and git commit?", "What should a good commit message explain?"],
        "Initialize a git repo, make three commits with meaningful messages, and view the history with git log --oneline.",
    ),
    T(
        "remotes", "Branches & Remotes", "Intermediate",
        ["branch/checkout", "push/pull", "Feature Branches"],
        "Working in isolation and syncing with a remote.",
        "A remote is a version of your repository hosted elsewhere, and push/pull synchronize commits. "
        "Branches let you work on features in isolation, merged back once ready.",
        "git remote add origin https://github.com/user/edumind.git\ngit branch feature/login\ngit checkout feature/login\ngit push -u origin feature/login",
        ["Create a branch and push it upstream for the first time"],
        ["Isolating in-progress feature work", "Syncing work across machines/collaborators", "Safe experimentation without touching main"],
        ["What does git push -u do the first time you push a branch?", "Why use a feature branch instead of committing straight to main?"],
        "Create a new branch, make a commit on it, push it to a remote, then open a pull request to merge it into main.",
    ),
]

# ---------------------------------------------------------------------------
# GITHUB — 2 topics
# ---------------------------------------------------------------------------
GITHUB_TOPICS = [
    T(
        "repos", "Repositories", "Beginner",
        ["Creating a Repo", "Cloning", "README"],
        "Hosting and cloning projects on GitHub.",
        "A GitHub repository hosts a Git project remotely, adding collaboration features like issues and a "
        "README. Cloning downloads a full copy of a remote repository, including its history.",
        "git clone https://github.com/user/edumind.git\ncd edumind\ngit log --oneline -5",
        ["Clone a repository and view recent history"],
        ["Open-source project hosting", "Team collaboration hubs", "Portfolio project showcases"],
        ["Does cloning get you the full commit history or just the latest files?", "What's the purpose of a good README.md?"],
        "Create a new GitHub repository, clone it locally, add a README, and push your first commit.",
    ),
    T(
        "prs", "Pull Requests & Code Review", "Intermediate",
        ["Opening a PR", "Reviewing Diffs", "Merging"],
        "Proposing and reviewing changes before merging.",
        "A pull request proposes merging changes from one branch into another, giving collaborators a chance "
        "to review the diff and comment before it's merged — central to how teams collaborate on GitHub.",
        "# 1. Open a PR comparing feature/login -> main\n# 2. Reviewers comment on the diff\n# 3. Push more commits to address feedback\n# 4. Merge once approved",
        ["The typical pull-request review workflow"],
        ["Team code review processes", "Catching bugs before they reach main", "Documenting why a change was made"],
        ["Why is a focused, single-purpose PR easier to review?", "What causes a merge conflict, and how do you resolve one?"],
        "Open a pull request for a small change, request feedback from a friend or teammate, and merge it once approved.",
    ),
]

# ---------------------------------------------------------------------------
# DOCKER — 2 topics
# ---------------------------------------------------------------------------
DOCKER_TOPICS = [
    T(
        "images", "Images & Dockerfiles", "Intermediate",
        ["Dockerfile", "FROM/COPY/RUN", "Building Images"],
        "Packaging an application into a reusable image.",
        "A Docker image is a read-only template built from a Dockerfile, listing the steps needed to package "
        "an application. Images are versioned with tags and can be pushed to a registry for sharing.",
        "FROM node:20\nWORKDIR /app\nCOPY package.json .\nRUN npm install\nCOPY . .\nCMD [\"node\", \"index.js\"]",
        ["A Dockerfile for a Node.js app"],
        ["Consistent environments across dev/staging/prod", "Packaging apps for easy distribution", "CI/CD build artifacts"],
        ["Why does COPY package.json come before COPY . . in a Dockerfile?", "What does the FROM instruction specify?"],
        "Write a Dockerfile for a simple Node.js app and build it into an image, then list your local images with docker images.",
    ),
    T(
        "containers", "Containers", "Intermediate",
        ["docker run", "Port Mapping", "docker ps/logs"],
        "Running images as isolated, live containers.",
        "A container is a running instance of an image, isolated from the host but sharing its kernel. "
        "docker run starts a container, and ports must be explicitly mapped to be reachable from outside.",
        "docker run -d -p 3000:3000 --name my-app edumind-app\ndocker ps\ndocker logs my-app",
        ["Run an image as a container with a mapped port"],
        ["Running local dev environments matching production", "Isolated microservices", "Quick throwaway environments for testing"],
        ["What does -p host_port:container_port do?", "Why are containers considered ephemeral by default?"],
        "Run your Node app image as a container, verify it's reachable in a browser on the mapped port, then stop and remove it.",
    ),
]

# ---------------------------------------------------------------------------
# AWS — 2 topics
# ---------------------------------------------------------------------------
AWS_TOPICS = [
    T(
        "core", "Core AWS Services", "Intermediate",
        ["EC2", "S3", "RDS", "Lambda"],
        "The foundational building blocks of AWS.",
        "AWS offers cloud computing building blocks: EC2 (virtual servers), S3 (object storage), RDS (managed "
        "relational databases), and Lambda (serverless functions billed only for execution time).",
        "aws s3 cp ./photo.jpg s3://my-edumind-bucket/photo.jpg",
        ["Upload a file to an S3 bucket via the CLI"],
        ["Hosting static assets and backups (S3)", "Running full-control servers (EC2)", "Event-driven serverless functions (Lambda)"],
        ["What's the key difference between EC2 and Lambda in terms of management overhead?", "What kind of data does S3 store, and what doesn't it do?"],
        "Create a free-tier AWS account, launch a small S3 bucket, and upload a test file using either the console or AWS CLI.",
    ),
    T(
        "deploy", "Deploying to AWS", "Advanced",
        ["Elastic Beanstalk", "Environment Variables", "Monitoring"],
        "Getting an application running on AWS infrastructure.",
        "Deploying to AWS commonly means EC2 (manual server management) or Elastic Beanstalk (a managed "
        "platform handling provisioning and scaling). Secrets should go through AWS-managed configuration.",
        "eb init edumind-app --platform node.js\neb create edumind-env\neb deploy",
        ["Deploy a Node.js app with Elastic Beanstalk"],
        ["Deploying production web applications", "Auto-scaling apps under variable load", "Managed infrastructure without manual server ops"],
        ["What does Elastic Beanstalk manage for you compared to raw EC2?", "Where should secrets like API keys be stored instead of hardcoding them?"],
        "Deploy a simple Node.js app to AWS Elastic Beanstalk and verify it's reachable at the generated URL.",
    ),
]

# ---------------------------------------------------------------------------
# LINUX — 2 topics
# ---------------------------------------------------------------------------
LINUX_TOPICS = [
    T(
        "shell", "Shell Basics", "Beginner",
        ["Navigation", "File Commands", "Pipes"],
        "Navigating and manipulating files from the command line.",
        "The Linux shell is a command-line interface for navigating the filesystem, manipulating files, and "
        "chaining commands together with pipes to build complex operations from simple tools.",
        "ls -la\ncd projects\ncat notes.txt | grep \"TODO\"",
        ["List, navigate, and filter file contents"],
        ["Server administration", "Automating repetitive file tasks", "Debugging and log inspection"],
        ["What does the pipe (|) operator do between two commands?", "What does ls -la show that plain ls doesn't?"],
        "Use ls, cd, and grep together to find all .txt files in a directory containing the word \"important\".",
    ),
    T(
        "process", "Processes", "Intermediate",
        ["ps/top", "kill", "Background Jobs"],
        "Inspecting and controlling running programs.",
        "Every running program is a process with a PID. ps/top show running processes, kill sends a signal to "
        "stop one, and & runs a command in the background without blocking your terminal.",
        "ps aux | grep node\nkill -9 1234\nnode server.js &\njobs",
        ["List processes, kill one, then start a background job"],
        ["Managing long-running servers", "Freeing up stuck/unresponsive processes", "Running multiple background tasks"],
        ["What's the difference between kill and kill -9?", "What does appending & to a command do?"],
        "Start a long-running script in the background with &, find its PID with ps, and stop it with kill.",
    ),
]

# ---------------------------------------------------------------------------
# MACHINE LEARNING — 2 topics
# ---------------------------------------------------------------------------
MACHINE_LEARNING_TOPICS = [
    T(
        "intro", "Machine Learning Introduction", "Beginner",
        ["Supervised vs Unsupervised", "Training Data"],
        "How machines learn patterns from data.",
        "Machine learning is a field of AI where systems learn patterns from data rather than being "
        "explicitly programmed with rules. Supervised learning trains on labeled examples; unsupervised "
        "learning finds structure in unlabeled data.",
        "# Conceptual: predicting house prices (supervised learning)\n# Input features: size, bedrooms, location\n# Label: actual sale price\n# The model learns a function mapping features -> price",
        ["The supervised learning setup, conceptually"],
        ["Recommendation systems", "Fraud/anomaly detection", "Predictive pricing and forecasting"],
        ["What's the key difference between supervised and unsupervised learning?", "How is a model's quality actually judged?"],
        "List three real-world problems and classify each as supervised (regression or classification) or unsupervised learning.",
    ),
    T(
        "models", "Common Model Types", "Intermediate",
        ["Linear Regression", "Decision Trees", "scikit-learn"],
        "Beginner-friendly model types and how to train them.",
        "Common beginner model types include linear regression, decision trees, and k-nearest neighbors. "
        "Scikit-learn is the standard Python library for building and evaluating these models.",
        "from sklearn.linear_model import LinearRegression\nimport numpy as np\nX = np.array([[1], [2], [3], [4]])\ny = np.array([2, 4, 6, 8])\nmodel = LinearRegression().fit(X, y)\nprint(model.predict([[5]]))",
        ["Train and predict with a simple linear regression model"],
        ["Forecasting numeric trends (sales, prices)", "Simple classification tasks", "Baseline models before trying deep learning"],
        ["Why is it important to evaluate a model on a held-out test set?", "Why are decision trees prone to overfitting without limits?"],
        "Train a LinearRegression model on a small synthetic dataset, split it into train/test sets, and evaluate it with mean squared error.",
    ),
]

# ---------------------------------------------------------------------------
# AI — 2 topics
# ---------------------------------------------------------------------------
AI_TOPICS = [
    T(
        "intro", "AI Introduction", "Beginner",
        ["What is AI?", "Rule-Based vs Learned Systems"],
        "The broad goal of building intelligent systems.",
        "Artificial Intelligence is the broad field of building systems that perform tasks normally requiring "
        "human intelligence. Modern AI progress has been driven largely by machine learning, especially deep "
        "learning trained on large datasets.",
        "def is_spam_rule_based(email):\n    return \"win money\" in email.lower()  # hardcoded rule\n\n# vs. a trained spam classifier that learns patterns from thousands of labeled emails",
        ["Compare a rule-based check with a learned classifier, conceptually"],
        ["Virtual assistants and chatbots", "Automated content moderation", "Predictive personalization"],
        ["What's a limitation of purely rule-based AI systems?", "How does a learned model's reasoning differ from a rule-based system's?"],
        "Compare a rule-based approach and a learned model for detecting spam emails, listing one advantage and one drawback of each.",
    ),
    T(
        "ml", "AI, ML, and Deep Learning", "Intermediate",
        ["The Hierarchy", "Deep Learning Basics"],
        "How AI, machine learning, and deep learning relate.",
        "Machine learning is the primary engine behind most modern AI systems. Deep learning, a subset of ML "
        "using multi-layered neural networks, powers the recent wave of advances in language and image "
        "generation.",
        "# AI (the goal)\n#  |-- Machine Learning (learning from data)\n#       |-- Deep Learning (neural networks with many layers)",
        ["The conceptual AI -> ML -> Deep Learning hierarchy"],
        ["Understanding AI product marketing claims", "Choosing the right technique for a problem's scale", "Evaluating compute/data needs for a project"],
        ["Is all AI machine learning? Why or why not?", "Why does deep learning typically need more data than traditional ML?"],
        "Find a recent AI product you use and identify whether it's likely powered by traditional ML, deep learning, or a rule-based system, based on its behavior.",
    ),
]

# ---------------------------------------------------------------------------
# DATA SCIENCE — 2 topics
# ---------------------------------------------------------------------------
DATA_SCIENCE_TOPICS = [
    T(
        "explore", "Exploratory Data Analysis", "Beginner",
        ["Pandas", "Summary Statistics", "Missing Values"],
        "Understanding a dataset before modeling anything.",
        "Exploratory data analysis is the first step in most data science work — understanding a dataset's "
        "shape, missing values, and distributions before modeling. Pandas and Matplotlib/Seaborn are the "
        "standard tools.",
        "import pandas as pd\ndf = pd.read_csv(\"students.csv\")\nprint(df.describe())\nprint(df.isnull().sum())",
        ["Summarize a dataset's statistics and missing values"],
        ["Sanity-checking a new dataset before analysis", "Spotting data quality issues early", "Informing cleaning and modeling decisions"],
        ["What does .describe() quickly reveal about a dataset?", "Why check for missing values before modeling?"],
        "Load a CSV dataset with Pandas and produce a summary of missing values, basic statistics, and a histogram of one numeric column.",
    ),
    T(
        "pipelines", "Data Pipelines", "Intermediate",
        ["Extract-Transform-Load", "Cleaning", "Feature Engineering"],
        "Moving data from raw to model-ready.",
        "A data pipeline moves data through extract, transform, and load stages. In data science, this "
        "typically means going from messy raw data to a clean, model-ready dataset.",
        "df = pd.read_csv(\"raw_scores.csv\")\ndf = df.dropna(subset=['score'])\ndf['score'] = df['score'].clip(0, 100)\ndf.to_csv(\"clean_scores.csv\", index=False)",
        ["Clean and save a dataset in a repeatable pipeline"],
        ["Preparing training data for ML models", "Automated reporting pipelines", "Data warehouse ETL jobs"],
        ["Why keep raw data files untouched and write cleaned data separately?", "Why can feature engineering matter more than model choice?"],
        "Build a small pipeline that reads a raw CSV, handles missing values, engineers one new feature, and saves the result to a new file.",
    ),
]

# ---------------------------------------------------------------------------
# CLOUD COMPUTING — 2 topics
# ---------------------------------------------------------------------------
CLOUD_COMPUTING_TOPICS = [
    T(
        "models", "Service Models (IaaS/PaaS/SaaS)", "Beginner",
        ["IaaS", "PaaS", "SaaS"],
        "How much infrastructure you manage vs. the provider.",
        "Cloud service models describe how much you manage vs. the provider manages: IaaS gives the most "
        "control, PaaS manages the runtime for you, and SaaS is a fully finished application you just use.",
        "# IaaS: You manage OS, runtime, and app  (e.g. raw EC2 VM)\n# PaaS: Provider manages OS/runtime  (e.g. Heroku)\n# SaaS: Provider manages everything  (e.g. Gmail)",
        ["A conceptual comparison of the three service models"],
        ["Choosing infrastructure for a new startup", "Balancing control vs. operational overhead", "Budgeting cloud spend by responsibility level"],
        ["What's the main tradeoff between IaaS and PaaS?", "Why might a company use all three models at once?"],
        "For a new project idea, decide whether IaaS, PaaS, or SaaS best fits your needs and justify the choice.",
    ),
    T(
        "deploy", "Deployment Models", "Intermediate",
        ["Public Cloud", "Private Cloud", "Hybrid Cloud"],
        "Where infrastructure lives and who can access it.",
        "Deployment models describe where infrastructure physically lives: public cloud (shared, from AWS/"
        "Azure/GCP), private cloud (dedicated to one org), and hybrid cloud (a mix, often for compliance).",
        "# Public: cost-efficient, scalable, shared infra (most startups)\n# Private: more control/compliance, higher cost (banks, healthcare)\n# Hybrid: sensitive data on-prem, rest in public cloud",
        ["A conceptual comparison of deployment models"],
        ["Regulated industries needing strict data control (private)", "Cost-efficient scaling for startups (public)", "Gradual cloud migration strategies (hybrid)"],
        ["Why might a bank choose private over public cloud?", "What extra complexity does a hybrid setup introduce?"],
        "Research one company's public cloud migration story and summarize why they chose their specific deployment model.",
    ),
]

# ---------------------------------------------------------------------------
# CYBER SECURITY — 2 topics
# ---------------------------------------------------------------------------
CYBER_SECURITY_TOPICS = [
    T(
        "intro", "Cybersecurity Fundamentals", "Beginner",
        ["CIA Triad", "Common Attack Types"],
        "The core principles behind protecting systems and data.",
        "Cybersecurity protects systems, networks, and data from unauthorized access, damage, or disruption. "
        "The CIA triad — Confidentiality, Integrity, Availability — is the foundation most decisions balance "
        "against.",
        "# Confidentiality: encrypting a password database\n# Integrity: checksums verifying a file wasn't tampered with\n# Availability: redundant servers so one outage doesn't take a service down",
        ["The CIA triad applied to a real system"],
        ["Protecting user data and credentials", "Ensuring service uptime under attack", "Preventing tampering with sensitive records"],
        ["What does each part of the CIA triad protect against?", "What does 'defense in depth' mean?"],
        "For a website you use, identify one measure that likely protects each part of the CIA triad — confidentiality, integrity, and availability.",
    ),
    T(
        "network", "Network Security", "Intermediate",
        ["Firewalls", "VPNs", "HTTPS/TLS"],
        "Protecting data as it travels across networks.",
        "Network security protects data in transit — firewalls filter traffic based on rules, VPNs create "
        "encrypted tunnels for remote access, and HTTPS (TLS) encrypts data between a browser and server.",
        "# Example firewall rule set\n# ALLOW inbound TCP port 443 (HTTPS)\n# ALLOW inbound TCP port 22 from trusted IP only (SSH)\n# DENY all other inbound traffic",
        ["A basic default-deny firewall ruleset"],
        ["Securing remote access to internal systems (VPN)", "Encrypting web traffic (HTTPS)", "Blocking unauthorized network access (firewalls)"],
        ["Why should a firewall's default policy generally be 'deny all'?", "What does HTTPS protect beyond just encrypting the data?"],
        "Inspect a website's SSL/TLS certificate in your browser (click the padlock icon) and identify who issued it and when it expires.",
    ),
]


# ---------------------------------------------------------------------------
# Full catalog: skill key -> (display name, category, description, topics)
# ---------------------------------------------------------------------------
SKILL_CATALOG = {
    "python": ("Python", "Programming", "Learn Python from fundamentals to advanced libraries and real projects.", PYTHON_TOPICS),
    "html": ("HTML", "Frontend", "Structure web pages with modern, accessible HTML.", HTML_TOPICS),
    "css": ("CSS", "Frontend", "Style and lay out web pages, from selectors to animation.", CSS_TOPICS),
    "javascript": ("JavaScript", "Programming", "The core language of the web, from syntax to async and the DOM.", JAVASCRIPT_TOPICS),
    "typescript": ("TypeScript", "Programming", "Add static types to JavaScript for safer, more maintainable code.", TYPESCRIPT_TOPICS),
    "java": ("Java", "Programming", "A statically-typed, object-oriented language for enterprise and Android development.", JAVA_TOPICS),
    "c": ("C", "Programming", "Low-level programming fundamentals and manual memory management.", C_TOPICS),
    "cpp": ("C++", "Programming", "Object-oriented systems programming with the STL.", CPP_TOPICS),
    "sql": ("SQL", "Databases", "Query and design relational databases with standard SQL.", SQL_TOPICS),
    "react": ("React", "Frontend", "Build interactive user interfaces with components, hooks, and state.", REACT_TOPICS),
    "nodejs": ("Node.js", "Backend", "Run JavaScript on the server and build APIs with Node.js.", NODEJS_TOPICS),
    "mongodb": ("MongoDB", "Databases", "Model, query, and scale data with MongoDB, from CRUD to aggregation.", MONGODB_TOPICS),
    "mysql": ("MySQL", "Databases", "The most widely used relational database management system.", MYSQL_TOPICS),
    "git": ("Git", "Tools", "Track changes and collaborate on code with Git.", GIT_TOPICS),
    "github": ("GitHub", "Tools", "Host repositories and collaborate through pull requests on GitHub.", GITHUB_TOPICS),
    "docker": ("Docker", "DevOps", "Package and run applications consistently with containers.", DOCKER_TOPICS),
    "aws": ("AWS", "Cloud", "Core AWS services and how to deploy applications to the cloud.", AWS_TOPICS),
    "linux": ("Linux", "Tools", "Navigate and administer systems from the Linux command line.", LINUX_TOPICS),
    "machine-learning": ("Machine Learning", "Data Science", "Learn how machines learn patterns from data.", MACHINE_LEARNING_TOPICS),
    "ai": ("Artificial Intelligence", "Data Science", "The broad field of building intelligent systems.", AI_TOPICS),
    "data-science": ("Data Science", "Data Science", "Explore, clean, and analyze data to find real insights.", DATA_SCIENCE_TOPICS),
    "cloud-computing": ("Cloud Computing", "Cloud", "Understand cloud service and deployment models.", CLOUD_COMPUTING_TOPICS),
    "cyber-security": ("Cyber Security", "Security", "Core principles of protecting systems, data, and networks.", CYBER_SECURITY_TOPICS),
}


def build_skill_payload(skill_key: str):
    entry = SKILL_CATALOG.get(skill_key)
    if not entry:
        return None
    display_name, category, description, topics = entry
    return {
        "id": skill_key,
        "skill_name": display_name,
        "category": category,
        "description": description,
        "overview": description,
        "topics": topics,
        "recommended_videos": [
            {
                "id": f"{skill_key}-video",
                "title": f"{display_name} Learning Guide",
                "channel": "EduMind Studio",
                "duration": "45m",
                "views": "120K views",
                "upload_date": "Recently added",
                "thumbnail_url": "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg",
                "url": "https://www.youtube.com/watch?v=ScMzIvxBSi4",
            }
        ],
    }


def build_generic_skill_payload(skill_name: str, category: str = "Programming"):
    """Fallback for a skill the curated catalog above doesn't cover yet (e.g. a
    custom skill added directly in the database). Keeps the API from ever 404ing,
    while every skill in SKILL_CATALOG returns full, real content instead of this."""
    return {
        "id": slugify(skill_name),
        "skill_name": skill_name,
        "category": category,
        "description": f"Learn {skill_name} from fundamentals to practical implementation.",
        "overview": f"{skill_name} is a core technology used to build modern products and tools.",
        "topics": [
            {
                "id": f"{slugify(skill_name)}-basics",
                "title": f"{skill_name} Fundamentals",
                "level": "Beginner",
                "subtopics": [],
                "summary": f"Get a strong foundation in {skill_name}.",
                "explanation": f"This topic introduces the core patterns and mental models behind {skill_name} so you can start building with confidence.",
                "code": f"# Example for {skill_name}\nprint('Start learning {skill_name}')",
                "examples": [f"Apply {skill_name} in a small hands-on example"],
                "useCases": ["Building a starter project", "Learning the workflow", "Solving beginner exercises"],
                "interviewQuestions": [f"Why is {skill_name} important in modern development?", f"How would you explain {skill_name} to a beginner?"],
                "practice": f"Build a small project applying the basics of {skill_name}.",
                "videos": [],
            },
        ],
        "recommended_videos": [
            {
                "id": f"{slugify(skill_name)}-video",
                "title": f"{skill_name} Learning Guide",
                "channel": "EduMind Studio",
                "duration": "45m",
                "views": "120K views",
                "upload_date": "Recently added",
                "thumbnail_url": "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg",
                "url": "https://www.youtube.com/watch?v=ScMzIvxBSi4",
            }
        ],
    }


def build_skill_catalog():
    return [build_skill_payload(key) for key in SKILL_CATALOG]


@router.get("/")
async def get_skills():
    skills = list(db.skills.find({}, {"_id": 1, "skill_name": 1, "category": 1, "description": 1}))
    if skills:
        items = []
        for skill in skills:
            key = slugify(skill["skill_name"])
            payload = build_skill_payload(key) or build_generic_skill_payload(skill["skill_name"], skill.get("category", "Programming"))
            items.append({
                "id": str(skill["_id"]),
                "skill_name": skill["skill_name"],
                "category": skill.get("category", payload["category"]),
                "description": skill.get("description", payload["description"]),
                "topic_count": len(payload.get("topics", [])),
            })
        return items

    catalog = build_skill_catalog()
    return [
        {
            "id": skill["id"],
            "skill_name": skill["skill_name"],
            "category": skill["category"],
            "description": skill["description"],
            "topic_count": len(skill.get("topics", [])),
        }
        for skill in catalog
    ]


@router.get("/skill/{skill_name}")
async def get_skill_content(skill_name: str):
    key = slugify(skill_name)
    skill = build_skill_payload(key)

    if not skill:
        # Also allow lookup by display name, e.g. "Machine Learning" -> "machine-learning"
        for candidate_key, (display_name, *_rest) in SKILL_CATALOG.items():
            if display_name.lower() == skill_name.lower():
                skill = build_skill_payload(candidate_key)
                break

    if not skill:
        skill = build_generic_skill_payload(skill_name)

    return {
        "id": skill["id"],
        "skill_name": skill["skill_name"],
        "category": skill["category"],
        "description": skill["description"],
        "overview": skill["overview"],
        "topics": skill["topics"],
        "recommended_videos": skill["recommended_videos"],
    }


@router.get("/{skill_id}")
async def get_skill(skill_id: str):
    try:
        skill = db.skills.find_one({"_id": ObjectId(skill_id)})
    except Exception:
        skill = None

    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {
        "id": str(skill["_id"]),
        "skill_name": skill["skill_name"],
        "category": skill["category"],
        "description": skill["description"],
    }