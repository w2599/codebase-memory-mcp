// MIT. Extends tree-sitter-objc 3.0.2 with Theos Logos syntax.
// Parse original bytes: no generated source, runtime Theos dependency or line map.
const ObjC = require('./objc-base');

module.exports = grammar(ObjC, {
  name: 'objc',
  rules: {
    _top_level_item: ($, original) => choice(original,
      $.logos_group, $.logos_function_definition, $.logos_constructor,
      $.logos_config, $.objc_nullability_region),

    // These SDK macros delimit a region, not a declaration.
    objc_nullability_region: $ => choice(
      'NS_ASSUME_NONNULL_BEGIN', 'NS_ASSUME_NONNULL_END',
      'CF_ASSUME_NONNULL_BEGIN', 'CF_ASSUME_NONNULL_END'),

    logos_group: $ => seq('%group', field('name', $.identifier),
      repeat($._top_level_item), '%end'),

    class_implementation: ($, original) => choice(original,
      seq('%hook', $.identifier, repeat($.implementation_definition), '%end'),
      seq('%subclass', $.identifier, ':', field('superclass', $.identifier),
        optional($.parameterized_arguments), repeat($.implementation_definition), '%end')),

    implementation_definition: ($, original) => choice(original,
      $.logos_new, $.property_declaration),

    logos_new: $ => seq('%new', optional(seq('(', $.string_literal, ')'))),

    property_declaration: ($, original) => choice(original,
      seq('%property', optional($.property_attributes_declaration),
        choice($.struct_declaration, $.atomic_declaration))),

    logos_function_definition: $ => seq('%hookf', '(',
      field('type', $.type_descriptor), ',', field('name', $.identifier),
      repeat(seq(',', choice($.parameter_declaration, $.variadic_parameter))), ')',
      field('body', $.compound_statement)),

    logos_constructor: $ => seq(
      field('name', alias(choice('%ctor', '%dtor'), $.identifier)),
      optional($.parameter_list), field('body', $.compound_statement)),

    logos_config: $ => prec.right(seq('%config', '(', $.identifier, '=',
      choice($.identifier, $.string_literal, $.number_literal), ')', optional(';'))),

    _expression_not_binary: ($, original) => choice(original,
      $.logos_original, $.logos_class, $.logos_init, $.logos_log),

    // Deliberately not call_expression: %orig is a call into the original
    // implementation, not a recursive edge to the hook being defined.
    logos_original: $ => prec.right(seq(choice('%orig', '&%orig'), optional($.argument_list))),
    logos_class: $ => seq('%c', '(', optional(choice('+', '-')), $.identifier, ')'),
    logos_init: $ => prec.right(seq('%init', optional($.argument_list))),
    logos_log: $ => prec.right(seq('%log', optional($.argument_list))),
  },
});
