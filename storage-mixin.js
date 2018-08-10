/**
 * in component some component
 <script>
        import storage_mixin from '@mixins/storage-mixin';
        import storage from './storage';
 
         export default {
                name: "some-component-name",
                mixins: [ storage_mixin ],
                data() { return { storage_name: 'component-storage-name' };},
                created() { this.register_storage(storage); },
                destroyed() { this.unregister_storage(); }
                computed:{
                    some_prop:{
                        get(){this.getStore('propName')}
                        set(val){this.doAction('actionName',val)}
                    }
                }
            };
 </script>
 *
 */

export default {
    methods: {
        checkStorage() {
            return !!this.$store.state[ this.storage_name ];
        },
        doAction(name, params) {
            if (this.checkStorage()) return this.$store.dispatch(`${this.storage_name}/${name}`, params);
        },
        getGetter(name, params) {
            if (this.checkStorage()) return this.$store.getters[ `${this.storage_name}/${name}` ](params);
        },
        doCommit(name, params) {
            this.checkStorage() && this.$store.commit(`${this.storage_name}/${name}`, params);
        },
        getStore(name) {
            if (this.checkStorage()) return this.$store.state[ this.storage_name ][ name ];
        },
        
        register_storage: function (storage) {
            console.log(`::${this.storage_name} -/registering::|| status::${this.checkStorage()}`);
            
            let result = false;
            if (!this.checkStorage()) {
                this.$store.registerModule(this.storage_name, storage);
                this.$store[ '_actions' ][ `${this.storage_name}/onRegisterStorage` ] && this.doAction('onRegisterStorage');
                result = true;
            }
            return result;
        },
        
        unregister_storage() {
            if (this.$store.state[ this.storage_name ]) this.$store.unregisterModule(this.storage_name);
        }
    }
};
