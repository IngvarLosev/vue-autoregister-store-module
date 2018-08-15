/**
 * in some component
 <script>
 import storage_mixin from '@mixins/storage-mixin';
 import storage from './storage';
 
 export default {
                name: "some-component-name",
                mixins: [ storage_mixin ],
                data() { return { storage_name: 'component-storage-name' };},
                created() { this.registerStorage(storage); },
                destroyed() { this.unregisterStorage(); }
                computed:{
                    some_prop:{
                        get(){this.getState('propName')}
                        set(val){this.doAction('actionName',val)}
                    }
                }
            };
 </script>
 *
 */

export default {
    methods: {
        
        isModuleExists(module_name) {
            return !!this.$store.state[ module_name || this.storage_name ];
        },
        doRootAction(name, params) {
            this.$store.dispatch(name, params);
        },
        doAction(name, params) {
            if (this.isModuleExists()) return this.$store.dispatch(`${this.storage_name}/${name}`, params);
        },
        getGetter(name, params) {
            if (this.isModuleExists()) {
                if (typeof this.$store.getters[ `${this.storage_name}/${name}` ] === 'function') {
                    return this.$store.getters[ `${this.storage_name}/${name}` ](params);
                } else {
                    return this.$store.getters[ `${this.storage_name}/${name}` ];
                }
            }
        },
        getRootGetter(name, params) {
            if (this.$store.getters[ name ]) {
                if (typeof this.$store.getters[ name ] === 'function') {
                    return this.$store.getters[ name ](params);
                } else {
                    return this.$store.getters[ name ];
                }
            }
        },
        getGetterFromModule(module, name, params) {
            if (this.isModuleExists(module)) {
                if (typeof this.$store.getters[ `${module}/${name}` ] === 'function') {
                    return this.$store.getters[ `${module}/${name}` ](params);
                } else {
                    return this.$store.getters[ `${module}/${name}` ];
                }
            }
        },
        doRootCommit(name, params) {
            this.$store.commit(name, params);
        },
        doCommit(name, params) {
            if (this.isModuleExists()) this.$store.commit(`${this.storage_name}/${name}`, params);
        },
        getRootState(name) {
            if (this.$store.state[ name ]) return this.$store.state[ name ];
        },
        getState(name) {
            if (this.isModuleExists()) return this.$store.state[ this.storage_name ][ name ];
        },
        getStateFromModule(module_name, prop_name) {
            if (this.isModuleExists(module_name)) return this.$store.state[ module_name ][ prop_name ];
        },
        registerStorage: function (storage) {
            let result = false;
            if (!this.isModuleExists()) {
                this.$store.registerModule(this.storage_name, storage);
                this.$store[ '_actions' ][ `${this.storage_name}/onRegisterStorage` ] && this.doAction('onRegisterStorage');
                result = true;
            }
            return result;
        },
        
        unregisterStorage() {
            if (this.$store.state[ this.storage_name ]) this.$store.unregisterModule(this.storage_name);
        }
    }
};
