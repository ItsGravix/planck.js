const _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;


const DEBUG_SOLVER = false;


export default class Controller {
    /** @internal */
    m_next: Controller | null = null;
    /** @internal */
    m_prev: Controller | null = null;
    /** @internal */
    m_bodyList: Controller | null = null;

    constructor() {
        console.log('hi')
    }
}