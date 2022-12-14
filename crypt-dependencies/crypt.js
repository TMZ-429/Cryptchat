const replacing = {
    'typeA': [
        ['0', 'g'],
        ['1', 'a'],
        ['2', 'l'],
        ['3', 'j'],
        ['4', 'i'],
        ['5', 'F'],
        ['6', 'p'],
        ['7', 'A'],
        ['8', 'P'],
        ['9', 'h'],

        ['a', '1'],
        ['b', 'y'],
        ['c', 'H'],
        ['d', 'q'],
        ['e', 'S'],
        ['f', 'K'],
        ['g', '0'],
        ['h', '9'],
        ['i', '4'],
        ['j', '3'],
        ['k', 'B'],
        ['l', '2'],
        ['m', 'Q'],
        ['n', 'R'],
        ['o', 'O'],
        ['p', '6'],
        ['q', 'd'],
        ['r', 'T'],
        ['s', 'N'],
        ['t', 'D'],
        ['u', 'M'],
        ['v', 'U'],
        ['w', 'V'],
        ['x', 'Y'],
        ['y', 'b'],
        ['z', 'z'],

        ['A', '7'],
        ['B', 'k'],
        ['C', 'L'],
        ['D', 't'],
        ['E', 'Z'],
        ['F', '5'],
        ['H', 'c'],
        ['I', 'J'],
        ['J', 'I'],
        ['K', 'f'],
        ['L', 'C'],
        ['M', 'u'],
        ['N', 's'],
        ['O', 'o'],
        ['P', '8'],
        ['Q', 'm'],
        ['R', 'n'],
        ['S', 'e'],
        ['T', 'r'],
        ['U', 'v'],
        ['V', 'w'],
        ['W', 'X'],
        ['X', 'W'],
        ['Y', 'x'],
        ['Z', 'E']
    ]
    //idk add your own charsets here 
};

const encrypt = {
    'typeA' : (content, encrypt) => {
        let characters = content.split(''), string = [], encrypt2 = (encrypt ? 0 : 1);
        for (var character of characters) {
            var replacer = (replacing.typeA.find(item => item[encrypt2] === character));
            if (replacer) {
                replacer = replacer[encrypt];
            } else {
                replacer = character;
            }
            string += replacer;
        }
        return string;
    }
    //idk make your own encryption things
}

module.exports = { encrypt };