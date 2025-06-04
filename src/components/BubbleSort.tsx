import { useState, type JSX } from 'react';
import { FaSortAmountDownAlt } from 'react-icons/fa';

const BubbleSort = () => {
    // Sorting section state
    const [sortInput, setSortInput] = useState('5,3,8,4,2');
    const [sortProcess, setSortProcess] = useState<JSX.Element[]>([]);
    const [sortResult, setSortResult] = useState('');
    const [sortResultClass, setSortResultClass] = useState('text-green-600');

    // Helper function to display arrays
    const displayArray = (arr: number[], label = '') => {
        return (
            <div className="mb-2">
                <span className="font-medium">{label}</span> {arr.join(' ')}
            </div>
        );
    };

    // Bubble sort with visualization
    const bubbleSortVisual = (arr: number[]) => {
        const processSteps: JSX.Element[] = [];
        const n = arr.length;
        let swapped;

        for (let i = 0; i < n - 1; i++) {
            swapped = false;

            for (let j = 0; j < n - i - 1; j++) {
                // Highlight the elements being compared
                const highlight = (arrCopy: number[], j: number) => {
                    return arrCopy.map((num, idx) => {
                        if (idx === j || idx === j + 1) {
                            return (
                                <span key={idx} className="highlight px-2 py-1 rounded bg-yellow-500 mx-0.5">
                                    {num}
                                </span>
                            );
                        }
                        return (
                            <span key={idx} className="px-2 py-1 mx-0.5">
                                {num}
                            </span>
                        );
                    });
                };

                // Display before comparison
                const beforeComparison = [...arr];
                processSteps.push(
                    <div key={`compare-${i}-${j}`} className="mb-2">
                        Comparing {beforeComparison[j]} and {beforeComparison[j + 1]}:{' '}
                        {highlight(beforeComparison, j)}
                    </div>
                );

                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true;

                    // Display after swap
                    const afterSwap = [...arr];
                    processSteps.push(
                        <div key={`swap-${i}-${j}`} className="mb-2 text-blue-600">
                            Swapped {afterSwap[j + 1]} and {afterSwap[j]}: {highlight(afterSwap, j)}
                        </div>
                    );
                }
            }

            // If no two elements were swapped, array is sorted
            if (!swapped) break;

            // Display pass completion
            processSteps.push(
                <div key={`pass-${i}`} className="my-2 font-medium">
                    After pass {i + 1}: {arr.join(' ')}
                </div>
            );
        }

        setSortProcess(processSteps);
        return arr;
    };

    // Perform sort
    const performSort = () => {
        const numbers = sortInput
            .split(',')
            .map((num) => parseInt(num.trim()))
            .filter((num) => !isNaN(num));

        if (numbers.length === 0) {
            setSortResult('Please enter valid numbers');
            setSortResultClass('text-red-600');
            return;
        }

        setSortProcess([displayArray(numbers, 'Initial array:')]);
        setSortResult('');

        // Perform bubble sort with visualization
        const sortedArray = bubbleSortVisual([...numbers]);

        setSortResult(sortedArray.join(', '));
        setSortResultClass('text-green-600');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4 flex items-center">
                <FaSortAmountDownAlt className="mr-2" /> Bubble Sort
            </h2>

            <div className="mb-4">
                <label htmlFor="sortInput" className="block text-gray-700 mb-2">
                    Enter numbers (comma separated):
                </label>
                <input
                    type="text"
                    id="sortInput"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={sortInput}
                    onChange={(e) => setSortInput(e.target.value)}
                />
            </div>

            <button
                id="sortBtn"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mb-4 transition"
                onClick={performSort}
            >
                Sort Array
            </button>

            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Sorting Process:</h3>
                <div id="sortProcess" className="flex flex-col gap-2 mb-4 min-h-12">
                    {sortProcess}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Sorted Result:</h3>
                <div id="sortResult" className={`text-xl font-semibold ${sortResultClass}`}>
                    {sortResult}
                </div>
            </div>

            <div className="code-block mt-4 bg-gray-800 text-gray-100 p-4 rounded-lg font-mono overflow-x-auto">
                <h4 className="text-gray-300 mb-2">Bubble Sort Algorithm:</h4>
                <pre>{`function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n-1; i++) {
    for (let j = 0; j < n-i-1; j++) {
      if (arr[j] > arr[j+1]) {
        // Swap elements
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}`}</pre>
            </div>
            <div className="mt-4 text-gray-700">
                <p><strong>How it works:</strong> Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>
            </div>
        </div>
    );
};

export default BubbleSort;