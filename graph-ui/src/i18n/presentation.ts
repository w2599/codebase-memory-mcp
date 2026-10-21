import { getLocale } from './locale';
import { tr } from './translate';
import type { SemanticIR } from '../core/semantic-ir';
import { displayFile, purposeSentence } from '../ir/semantic-ir-builder';

const kinds: Readonly<Record<string, string>> = {
    function: '函数', method: '方法', class: '类', interface: '接口', module: '模块',
    file: '文件', folder: '文件夹', project: '项目', package: '包', variable: '变量',
    field: '字段', property: '属性', type: '类型', enum: '枚举', struct: '结构体',
    trait: '特征', constant: '常量', namespace: '命名空间', macro: '宏', decorator: '装饰器',
    route: '路由', resource: '资源', section: '章节', test: '测试', branch: '分支',
    node: '节点', symbol: '符号', area: '区域', unknown: '未知',
    calls: '调用', imports: '导入', usage: '引用', inherits: '继承', implements: '实现',
    defines: '定义', contains: '包含', constructs: '构造', raises: '抛出',
    reads: '读取', writes: '写入', configures: '配置', tests: '测试',
    data_flows: '数据流', http_calls: 'HTTP 调用', async_calls: '异步调用',
    handles: '处理', exposes: '暴露', depends_on: '依赖', returns: '返回',
};

/** Display labels never replace the original graph type used by filters or queries. */
export function kindLabel(value: string): string {
    return getLocale() === 'zh' ? kinds[value.toLowerCase()] ?? value : value;
}

/** Only the frontend-generated purpose sentence is localized; source prose stays verbatim. */
export function purposeSummary(ir: SemanticIR): string {
    const calls = ir.steps.value.length, reads = ir.reads.value.length, errors = ir.throws.value.length;
    if (getLocale() !== 'zh' || ir.purpose.value !== purposeSentence(ir.symbol, calls, reads, errors)) return ir.purpose.value;
    return tr`${kindLabel(ir.symbol.kind)} ${ir.symbol.name} in ${displayFile(ir.symbol.uri)}. Makes ${calls} calls, touches ${reads} environment values, can raise ${errors} error types.`;
}
