import { getLocale } from './locale';

/** Presentation units only. Protocol discriminants remain in English. */
const groups: readonly (readonly [string, string, string])[] = [
    ['changed file', 'changed files', '个变更文件'],
    ['symbol', 'symbols', '个符号'],
    ['node', 'nodes', '个节点'],
    ['edge', 'edges', '条关系边'],
    ['direct neighbour', 'direct neighbours', '个直接邻居'],
    ['incoming neighbour', 'incoming neighbours', '个入向邻居'],
    ['outgoing neighbour', 'outgoing neighbours', '个出向邻居'],
    ['seed declaration', 'seed declarations', '个起始声明'],
    ['caller', 'callers', '个调用方'],
    ['walked step', 'walked steps', '个已遍历步骤'],
    ['route', 'routes', '条路由'],
    ['branch', 'branches', '条分支'],
    ['file differs', 'files differ', '个文件'],
    ['declaration', 'declarations', '个声明'],
    ['further symbol', 'further symbols', '个其他符号'],
    ['step', 'steps', '步'],
    ['endpoint is', 'endpoints are', '个端点'],
    ['test caller', 'test callers', '个测试调用方'],
    ['affected symbol', 'affected symbols', '个受影响符号'],
    ['indexed source file', 'indexed source files', '个已索引源文件'],
    ['file', 'files', '个文件'],
    ['call', 'calls', '次调用'],
    ['environment value', 'environment values', '个环境值'],
    ['error type', 'error types', '种错误类型'],
    ['place', 'places', '个位置'],
    ['selected symbol', 'selected symbols', '个选中符号'],
    ['more symbol', 'more symbols', '个其他符号'],
    ['name', 'names', '个名称'],
    ['one', 'ones', '项'],
    ['more import', 'more imports', '项其他导入'],
    ['hop', 'hops', '跳'],
    ['arrow closes', 'arrows close', '条箭头'],
    ['call is', 'calls are', '次调用'],
    ['reached symbol carries', 'reached symbols carry', '个已到达符号包含'],
    ['file imports', 'files import', '个文件导入'],
    ['other piece of code', 'other pieces of code', '个其他代码单元'],
    ['value', 'values', '个值'],
    ['kind of error', 'kinds of error', '种错误类型'],
    ['further part is', 'further parts are', '个其他部分'],
    ['test calls', 'tests call', '个测试调用'],
    ['call site', 'call sites', '个调用位置'],
    ['function', 'functions', '个函数'],
    ['configuration value is', 'configuration values are', '个配置值'],
    ['type', 'types', '种类型'],
    ['class', 'classes', '个类'],
];
export const countWords: Readonly<Record<string, string>> = Object.fromEntries(groups.flatMap(([one, many, chinese]) => [[one, chinese], [many, chinese]]));

export function formatCount(count: number, singular: string, plural: string, formattedCount = String(count)): string {
    const word = count === 1 ? singular : plural;
    return `${formattedCount} ${getLocale() === 'zh' ? countWords[word] ?? word : word}`;
}
