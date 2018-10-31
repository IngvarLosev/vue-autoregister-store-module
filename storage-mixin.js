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
    data() {
        return {
            store_debug:false,
            external_storage: false
        };
    },
    
    mounted() { setTimeout(() => { this.setCreationState('mounted'); }); },
    destroyed() {
        if (!!this.storage_name && this.getState('component_creation_state') === 'mounted' && !this.external_storage) {
            this.unregisterStorage();
        }
    },
    
    methods: {
        setCreationState(state) { this.doCommit('setComponentCreationState', state); },
        isModuleExists(module_name) { return !!this.$store.state[ module_name || this.storage_name ]; },
    
        getState(name) {
            if (this.isModuleExists()) return this.$store.state[ this.storage_name ][ name ];
        },
        doCommit(name, params) {
            if (this.isModuleExists()) this.$store.commit(`${this.storage_name}/${name}`, params);
        },
        doAction(name, params) { if (this.isModuleExists()) return this.$store.dispatch(`${this.storage_name}/${name}`, params); },
        getGetter(name, params) {
            if (this.isModuleExists()) {
                if (typeof this.$store.getters[ `${this.storage_name}/${name}` ] === 'function') {
                    return this.$store.getters[ `${this.storage_name}/${name}` ](params);
                } else {
                    return this.$store.getters[ `${this.storage_name}/${name}` ];
                }
            }
        },
    
        getRootState(name) {
            if (this.$store.state[ name ]) return this.$store.state[ name ];
        },
        doRootCommit(name, params) { this.$store.commit(name, params); },
        doRootAction(name, params) { this.$store.dispatch(name, params); },
        getRootGetter(name, params) {
            if (this.$store.getters[ name ]) {
                if (typeof this.$store.getters[ name ] === 'function') {
                    return this.$store.getters[ name ](params);
                } else {
                    return this.$store.getters[ name ];
                }
            }
        },
    
        getGenState(prop_name) {
            if (this.isModuleExists('general')) return this.$store.state[ 'general' ][ prop_name ];
        },
        doGenCommit(commit_name, value) {
            if (this.isModuleExists('general')) this.$store.commit(`general/${commit_name}`, value);
        },
        doGenAction(name, params) {
            if (this.isModuleExists('general')) {
                return this.$store.dispatch(`general/${name}`, params);
            } else {
                console.log(`not exist general/${name}`, params);
            }
        },
        getGenGetter(name, params) {
            if (this.isModuleExists('general')) {
                if (typeof this.$store.getters[ `general/${name}` ] === 'function') {
                    return this.$store.getters[ `general/${name}` ](params);
                } else {
                    return this.$store.getters[ `general/${name}` ];
                }
            }
        },
    
        getStateFromModule(module_name, prop_name) {
            if (this.isModuleExists(module_name)) return this.$store.state[ module_name ][ prop_name ];
        },
        doCommitFromModule(module_name, commit_name, value) {
            if (this.isModuleExists(module_name)) this.$store.commit(`${module_name}/${commit_name}`, value);
        },
        doActionFromModule(module, name, params) {
            if (this.isModuleExists(module)) {
                return this.$store.dispatch(`${module}/${name}`, params);
            } else {
                console.log(`not exist ${module}/${name}`, params);
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
       
        registerStorage(storage, status) {
            if (!this.isModuleExists()) {
                this.dlog(`%c registering %c ${this.storage_name} `, "background:#1F99A5 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
                    "background:#35495e ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff");
                this.$store.registerModule(this.storage_name, storage);
                //@todo проверить работает ли эта проверка
                this.$store[ '_actions' ][ `${this.storage_name}/onRegisterStorage` ] && this.doAction('onRegisterStorage');
            }
            status && this.setCreationState(status);
        },
        unregisterStorage() {
            
            if (this.$store.state[ this.storage_name ]) {
                this.dlog(`%c unregister  %c ${this.storage_name}, ${!!this.$store.state[ this.storage_name ]} `, "background:#A51F99 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
                    "background:#35495e ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff");
                this.$store.unregisterModule(this.storage_name);
            }
        },
        dlog(...mess) { this.store_debug && console.info(...mess); }
        
    }
};
