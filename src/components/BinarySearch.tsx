import { useState, type JSX } from 'react';
import { FaSearch } from 'react-icons/fa';

const BinarySearch = () => {
    // Searching section state
    const [searchInput, setSearchInput] = useState('2,3,4,5,8');
    const [searchValue, setSearchValue] = useState('5');
    const [searchSteps, setSearchSteps] = useState<JSX.Element[]>([]);
    const [searchResult, setSearchResult] = useState('');
    const [searchResultClass, setSearchResultClass] = useState('');

    // Binary search with visualization
    const binarySearchVisual = (arr: number[], target: number) => {
        const steps: JSX.Element[] = [];
        let left = 0;
        let right = arr.length - 1;
        let step = 0;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            step++;

            // Display current search range and middle element
            const range = arr.slice(left, right + 1);
            const midValue = arr[mid];

            const rangeDisplay = range.map((num, idx) => {
                const actualIdx = left + idx;
                if (actualIdx === mid) {
                    return (
                        <span key={idx} className="highlight px-2 py-1 rounded bg-yellow-500 mx-1">
                            {num}
                        </span>
                    );
                }
                return (
                    <span key={idx} className="px-2 py-1 mx-1">
                        {num}
                    </span>
                );
            });

            steps.push(
                <div key={`step-${step}`} className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Step {step}:</div>
                    <div>Searching in [{rangeDisplay}]</div>
                    <div>Middle element: {midValue}</div>
                    <div>Comparing {midValue} with target {target}</div>
                </div>
            );

            if (arr[mid] === target) {
                return { result: mid, steps };
            } else if (arr[mid] < target) {
                left = mid + 1;
                steps.push(
                    <div key={`step-right-${step}`} className="mb-3 p-3 bg-blue-50 rounded-lg">
                        Target is greater than middle element, searching right half
                    </div>
                );
            } else {
                right = mid - 1;
                steps.push(
                    <div key={`step-left-${step}`} className="mb-3 p-3 bg-blue-50 rounded-lg">
                        Target is less than middle element, searching left half
                    </div>
                );
            }
        }

        return { result: -1, steps };
    };

    // Perform search
    const performSearch = () => {
        const numbers = searchInput
            .split(',')
            .map((num) => parseInt(num.trim()))
            .filter((num) => !isNaN(num));
        const target = parseInt(searchValue);

        if (numbers.length === 0 || isNaN(target)) {
            setSearchResult('Please enter valid numbers and target');
            setSearchResultClass('text-red-600');
            return;
        }

        setSearchSteps([]);
        setSearchResult('');

        // Perform binary search with visualization
        const { result, steps } = binarySearchVisual(numbers, target);

        setSearchSteps(steps);

        if (result === -1) {
            setSearchResult(`${target} not found in the array`);
            setSearchResultClass('text-red-600');
        } else {
            setSearchResult(`${target} found at index ${result}`);
            setSearchResultClass('text-green-600');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4 flex items-center">
                <FaSearch className="mr-2" /> Binary Search
            </h2>

            <div className="mb-4">
                <label htmlFor="searchInput" className="block text-gray-700 mb-2">
                    Enter sorted numbers (comma separated):
                </label>
                <input
                    type="text"
                    id="searchInput"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="searchValue" className="block text-gray-700 mb-2">
                    Number to search:
                </label>
                <input
                    type="number"
                    id="searchValue"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>

            <button
                id="searchBtn"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mb-4 transition"
                onClick={performSearch}
            >
                Search Number
            </button>

            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Search Steps:</h3>
                <div id="searchSteps" className="mb-4">
                    {searchSteps}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Search Result:</h3>
                <div id="searchResult" className={`text-xl font-semibold ${searchResultClass}`}>
                    {searchResult}
                </div>
            </div>

            <div className="code-block mt-4 bg-gray-800 text-gray-100 p-4 rounded-lg font-mono overflow-x-auto">
                <h4 className="text-gray-300 mb-2">Binary Search Algorithm:</h4>
                <pre>{`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Not found
}`}</pre>
            </div>
            <div className="mt-4 text-gray-700">
                <p><strong>How it works:</strong> Binary search works on sorted arrays. It compares the target value to the middle element of the array. If they are not equal, the half in which the target cannot lie is eliminated and the search continues on the remaining half until the target is found or the remaining half is empty.</p>
            </div>
        </div>
    );
};

export default BinarySearch;