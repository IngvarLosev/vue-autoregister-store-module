export default {
    methods: {
        clearObject(val) { return JSON.parse(JSON.stringify(val)); },
        
        /**
         * $store....
         */
        isModuleExists(module_name) { return !!this.$store.state[ module_name ]; },
        getMutationName(prop_name) {
            return (
                'set' +
                `${ prop_name }`
                    .split('_')
                    .map(item => item.charAt(0).toLocaleUpperCase() + item.slice(1))
                    .join('')
            );
        },
        _state(prop, val) {
            if (typeof prop === 'undefined') return;
            if (typeof val === 'undefined') {
                return this.$store.state[ prop ];
            } else {
                this.$store.commit(this.getMutationName(prop), val);
            }
        },
        _stateFm(module, prop, val) {
            if (!this.isModuleExists(module)) return;
            if (typeof val === 'undefined') {
                return this.$store.state[ module ][ prop ];
            } else {
                this.$store.commit(`${ module }/${ this.getMutationName(prop) }`, val);
            }
        },
        _action(name, val) { return this.$store.dispatch(name, val); },
        _actionFm(module, name, val) {
            if (!this.isModuleExists(module)) return;
            return this._action(`${ module }/${ name }`, val);
        },
        _getter(name, params) {
            return (typeof this.$store.getters[ name ] === 'function')
                   ? this.$store.getters[ name ](params)
                   : this.$store.getters[ name ];
        },
        _getterFm(module, name, param) {
            if (!this.isModuleExists(module)) return;
            return this._getter(`${ module }/${ name }`, param);
        },
        
        /**
         * $router....
         */
        _routerTo(name) {
            if (this.$router) this.$router.push({ name: name });
        }
    }
};
