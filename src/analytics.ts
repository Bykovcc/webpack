import * as $ from 'jquery';

function createAnalitics(): object {
    let counter = 0;
    let desroyed: boolean = false;

    const listener = (): number => counter++;

    $(document).on("click", listener);

    return {
        destroy() {
            $(document).off('click', listener);
            desroyed = true;
        },
        getClicks() {
            if (desroyed) {
                return 'Analitics destroyed';
            }
            return counter;
        }
    }
}

window['analytics'] = createAnalitics();