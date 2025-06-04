import { useState, useRef, useEffect, type JSX } from 'react';
import { FaUndo, FaTrashAlt } from 'react-icons/fa';

// Stack class implementation
class Stack<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    push(element: T): void {
        this.items.push(element);
    }

    pop(): T | null {
        if (this.isEmpty()) return null;
        return this.items.pop() as T;
    }

    peek(): T | null {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    clear(): void {
        this.items = [];
    }

    getItems(): T[] {
        return [...this.items];
    }
}

const StackUndo = () => {
    // Stack section state
    const [textInput, setTextInput] = useState('');
    const [currentText, setCurrentText] = useState('');
    const [stackHistory, setStackHistory] = useState<JSX.Element[]>([]);
    const textHistory = useRef(new Stack<string>());
    const lastText = useRef('');

    // Handle text input for stack
    const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.target.value;
        setTextInput(currentValue);
        setCurrentText(currentValue);

        // Save previous version to stack
        if (lastText.current !== '' && lastText.current !== currentValue) {
            textHistory.current.push(lastText.current);
            updateStackDisplay();
        }

        lastText.current = currentValue;
    };

    // Perform undo
    const performUndo = () => {
        if (textHistory.current.isEmpty()) return;

        const previousText = textHistory.current.pop() as string;
        setTextInput(previousText);
        setCurrentText(previousText);
        lastText.current = previousText;

        updateStackDisplay();
    };

    // Clear history
    const clearHistory = () => {
        textHistory.current.clear();
        setStackHistory([<div key="empty" className="text-gray-500">Stack is empty</div>]);
    };

    // Update stack display
    const updateStackDisplay = () => {
        if (textHistory.current.isEmpty()) {
            setStackHistory([<div key="empty" className="text-gray-500">Stack is empty</div>]);
            return;
        }

        // Display stack items (top to bottom)
        const items = [...textHistory.current.getItems()].reverse();
        const historyElements = items.map((item, idx) => {
            return (
                <div key={idx} className={`p-2 mb-1 bg-gray-100 rounded ${idx === 0 ? 'bg-indigo-100 font-medium' : ''}`}>
                    {idx === 0 ? `TOP: "${item}"` : `"${item}"`}
                </div>
            );
        });

        setStackHistory(historyElements);
    };

    // Initialize
    useEffect(() => {
        updateStackDisplay();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4 flex items-center">
                <FaUndo className="mr-2" /> Stack (Undo Function)
            </h2>

            <div className="mb-4">
                <label htmlFor="textInput" className="block text-gray-700 mb-2">
                    Type something:
                </label>
                <input
                    type="text"
                    id="textInput"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Start typing..."
                    value={textInput}
                    onChange={handleTextInput}
                />
            </div>

            <div className="flex gap-2 mb-6 items-center">
                <button
                    id="undoBtn"
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center ${textHistory.current.isEmpty() ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    onClick={performUndo}
                    disabled={textHistory.current.isEmpty()}
                >
                    <FaUndo className="mr-2" /> Undo
                </button>

                <button
                    id="clearBtn"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center"
                    onClick={clearHistory}
                >
                    <FaTrashAlt className="mr-2" /> Clear History
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Current Text:</h3>
                    <div id="currentText" className="text-xl font-semibold text-green-600 min-h-8">
                        {currentText}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Previous Versions (Stack):</h3>
                    <div id="stackHistory" className="border rounded-lg p-4 min-h-32 bg-gray-50">
                        {stackHistory}
                    </div>
                </div>
            </div>

            <div className="code-block mt-6 bg-gray-800 text-gray-100 p-4 rounded-lg font-mono overflow-x-auto">
                <h4 className="text-gray-300 mb-2">Stack Implementation:</h4>
                <pre>{`// Stack class
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
  }
  
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
  
  clear() {
    this.items = [];
  }
}`}</pre>
            </div>
            <div className="mt-4 text-gray-700">
                <p><strong>How it works:</strong> A stack is a Last-In-First-Out (LIFO) data structure. The undo functionality uses a stack to keep track of previous states. Each time the text changes, we push the previous version onto the stack. When undo is clicked, we pop the last version from the stack and restore it.</p>
            </div>
        </div>
    );
};

export default StackUndo;