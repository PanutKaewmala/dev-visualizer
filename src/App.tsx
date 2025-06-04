import BinarySearch from './components/BinarySearch';
import BubbleSort from './components/BubbleSort';
import StackUndo from './components/StackUndo';

const AlgorithmVisualizer = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-indigo-700 mb-2">Algorithm Visualizer</h1>
                    <p className="text-gray-600">Interactive demonstration of fundamental algorithms and data structures</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <BubbleSort />
                    <BinarySearch />
                    <StackUndo />
                </div>
            </div>
        </div>
    );
};

export default AlgorithmVisualizer;